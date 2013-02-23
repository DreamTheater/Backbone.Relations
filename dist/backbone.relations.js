/*!
 * Backbone.Relations v0.1.5
 * https://github.com/DreamTheater/Backbone.Relations
 *
 * Copyright (c) 2013 Dmytro Nemoga
 * Released under the MIT license
 */
Backbone.Model = (function (Model) {
    'use strict';

    return Model.extend({
        _RelatedModels: Backbone.Collection.extend({
            initialize: function () {
                this.on('add', function (model, collection, options) {
                    this.model.collection.add(model, options);
                });

                this.on('remove', function (model, collection, options) {
                    this.model.collection.remove(model, options);
                });
            }
        }),

        constructor: function () {

            /////////////////
            // DEFINITIONS //
            /////////////////

            this._relations = {};

            /////////////////

            Model.apply(this, arguments);

            if (this.collection) {
                this.constructor.collection = this.collection;
            }
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
                    var RelatedModels = this._RelatedModels,

                        hash = this._makeHash(null, foreignKey),
                        models = Model.collection.where(hash);

                    return new RelatedModels(models, {
                        model: Model
                    });
                }
            }, options);

            return this;
        },

        toJSON: _.wrap(Model.prototype.toJSON, function (toJSON, options) {

            ///////////////
            // INSURANCE //
            ///////////////

            options = options || {};

            ///////////////

            var attributes = toJSON.call(this, options),

                callerOptions = _.extend({}, options, {
                    caller: this
                });

            if (options.relations) {
                _.each(this._relations, function (relation, attribute) {
                    var Model = relation.Model, relatedModel;

                    if (!(options.caller instanceof Model)) {
                        relatedModel = relation.reference.get.call(this);
                        attributes[attribute] = relatedModel.toJSON(callerOptions);
                    }

                    delete attributes[relation.options.foreignKey];
                }, this);
            }

            return attributes;
        }),

        _createRelation: function (Model, reference, options) {
            var name = _.string.capitalize(options.as);

            if (reference.get) {
                this['get' + name] = reference.get;
            }

            if (reference.set) {
                this['set' + name] = reference.set;
            }

            if (reference.build) {
                this['build' + name] = reference.build;
            }

            if (reference.create) {
                this['create' + name] = reference.create;
            }

            this._relations[options.as] = {
                Model: Model,
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
}(Backbone.Model));
