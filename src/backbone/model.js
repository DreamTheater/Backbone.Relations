(function () {
    'use strict';

    ////////////////
    // SUPERCLASS //
    ////////////////

    var Model = Backbone.Model;

    ////////////////

    /**
     * @class
     */
    Backbone.Model = Model.extend({
        /**
         * @class
         */
        _collection: Backbone.Collection.extend({
            initialize: function () {
                this.on('add', function (model, collection, options) {
                    this.model.collection.add(model, options);
                });

                this.on('remove', function (model, collection, options) {
                    this.model.collection.remove(model, options);
                });
            }
        }),

        /**
         * @constructor
         */
        constructor: function (attributes, options) {

            ////////////////
            // PROPERTIES //
            ////////////////

            this._relations = {};

            ////////////////

            /**
             * @override
             */
            this.initialize = _.wrap(this.initialize, function (fn, attributes, options) {
                return fn.call(this, attributes, options);
            });

            Model.call(this, attributes, options);
        },

        belongsTo: function (Model, options) {
            var foreignKey = options.foreignKey;

            this._createRelation(Model, {
                get: function () {
                    var id = this.attributes[foreignKey];

                    return Model.collection.get(id);
                },

                set: function (model, options) {
                    return this.set(foreignKey, model.id, options);
                },

                build: function (attributes, options) {
                    return new Model(attributes, options);
                },

                create: function (attributes, options) {
                    return Model.collection.create(attributes, options);
                }
            }, options);

            return this;
        },

        hasOne: function (Model, options) {
            var foreignKey = options.foreignKey;

            this._createRelation(Model, {
                get: function () {
                    var hash = this._makeHash(null, foreignKey);

                    return Model.collection.findWhere(hash);
                },

                set: function (model, options) {
                    return model.set(foreignKey, this.id, options);
                },

                build: function (attributes, options) {
                    var hash = this._makeHash(attributes, foreignKey);

                    return new Model(hash, options);
                },

                create: function (attributes, options) {
                    var hash = this._makeHash(attributes, foreignKey);

                    return Model.collection.create(hash, options);
                }
            }, options);

            return this;
        },

        hasMany: function (Model, options) {
            var foreignKey = options.foreignKey;

            this._createRelation(Model, {
                get: function () {
                    var Collection = this._collection,

                        hash = this._makeHash(null, foreignKey),
                        models = Model.collection.where(hash);

                    return new Collection(models, {
                        model: Model
                    });
                }
            }, options);

            return this;
        },

        _createRelation: function (Model, reference, options) {
            var name = options.as, referenceName = name.charAt(0).toUpperCase() + name.substr(1),

                get = reference.get,
                set = reference.set,
                build = reference.build,
                create = reference.create;

            if (get) this['get' + referenceName] = get;
            if (set) this['set' + referenceName] = set;
            if (build) this['build' + referenceName] = build;
            if (create) this['create' + referenceName] = create;

            this._relations[name] = {
                model: Model,
                reference: reference,
                options: options
            };
        },

        _makeHash: function (attributes, foreignKey) {
            var hash = _.clone(attributes) || {};

            hash[foreignKey] = this.id;

            return hash;
        }
    });
}());
