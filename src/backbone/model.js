(function () {
    'use strict';

    // Superclass
    var Model = Backbone.Model;

    /**
     * @class Backbone.Model
     */
    Backbone.Model = Model.extend({
        _RelatedModels: Backbone.Collection.extend({
            initialize: function () {
                // Listen "add" events
                this.on('add', function (model, collection, options) {
                    this.model.collection.add(model, options);
                });

                // Listen "remove" events
                this.on('remove', function (model, collection, options) {
                    this.model.collection.remove(model, options);
                });
            }
        }),

        /**
         * @constructor
         */
        constructor: function () {

            /////////////////
            // DEFINITIONS //
            /////////////////

            this._relations = {};

            /////////////////

            // Call parent's constructor
            Model.apply(this, arguments);

            // Create global reference to collection
            if (this.collection) {
                // Save collection's instance as static property
                this.constructor.collection = this.collection;
            }
        },

        belongsTo: function (Model, options) {
            // Foreign key
            var foreignKey = options.foreignKey;

            // Create reference methods
            this._createReference(Model, {
                // Getter method
                get: function () {
                    var id = this.attributes[foreignKey];

                    return Model.collection.get(id);
                },

                // Setter method
                set: function (model, options) {
                    return this.set(foreignKey, model.id, options);
                },

                // Builder method
                build: function (attributes, options) {
                    return new Model(attributes, options);
                },

                // Creator method
                create: function (attributes, options) {
                    return Model.collection.create(attributes, options);
                }
            }, options);

            return this;
        },

        hasOne: function (Model, options) {
            // Foreign key
            var foreignKey = options.foreignKey;

            // Create reference methods
            this._createReference(Model, {
                // Getter method
                get: function () {
                    // Hash of attributes
                    var hash = this._makeHash(null, foreignKey);

                    return Model.collection.where(hash)[0];
                },

                // Setter method
                set: function (model, options) {
                    return model.set(foreignKey, this.id, options);
                },

                // Builder method
                build: function (attributes, options) {
                    // Hash of attributes
                    var hash = this._makeHash(attributes, foreignKey);

                    return new Model(hash, options);
                },

                // Creator method
                create: function (attributes, options) {
                    // Hash of attributes
                    var hash = this._makeHash(attributes, foreignKey);

                    return Model.collection.create(hash, options);
                }
            }, options);

            return this;
        },

        hasMany: function (Model, options) {
            // Foreign key
            var foreignKey = options.foreignKey;

            // Create reference methods
            this._createReference(Model, {
                // Getter method
                get: function () {
                    // Collection of related models
                    var RelatedModels = this._RelatedModels,

                        // Hash of attributes
                        hash = this._makeHash(null, foreignKey),
                        // Array of related models
                        models = Model.collection.where(hash);

                    return new RelatedModels(models, {
                        model: Model
                    });
                }
            }, options);

            return this;
        },

        _createReference: function (Model, reference, options) {
            // Reference name
            var name = _.string.classify(options.as);

            // Create get{name}() method
            if (reference.get) {
                this['get' + name] = reference.get;
            }

            // Create set{name}(model, options) method
            if (reference.set) {
                this['set' + name] = reference.set;
            }

            // Create build{name}(attributes, options) method
            if (reference.build) {
                this['build' + name] = reference.build;
            }

            // Create create{name}(attributes, options) method
            if (reference.create) {
                this['create' + name] = reference.create;
            }

            // Add new relation
            this._addRelation(Model, reference, options);
        },

        _addRelation: function (Model, reference, options) {
            // Add relation into list
            this._relations[options.as] = {
                Model: Model,
                reference: reference,
                options: options
            };
        },

        _makeHash: function (attributes, foreignKey) {
            // Original attributes hash
            var hash = _.clone(attributes) || {};

            // Add "foreignKey" attribute into hash
            hash[foreignKey] = this.id;

            return hash;
        }
    });
}());
