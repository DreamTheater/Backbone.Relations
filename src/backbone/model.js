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
        constructor: function () {

            /////////////////
            // DEFINITIONS //
            /////////////////

            this._relations = {};

            /////////////////

            // Call parent constructor
            Model.apply(this, arguments);

            // Create the global reference to collection
            if (this.collection) {
                // Save instance of collection as static property
                this.constructor.collection = this.collection;
            }
        },

        belongsTo: function (Model, options) {
            // Foreign key
            var foreignKey = options.foreignKey;

            // Create reference methods
            return this._createReference(Model, {
                // Getter method
                get: function () {
                    var id = this.get(foreignKey);

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
        },

        hasOne: function (Model, options) {
            // Foreign key
            var foreignKey = options.foreignKey;

            // Create reference methods
            return this._createReference(Model, {
                // Getter method
                get: function () {
                    // Attributes hash
                    var hash = this._makeHash(null, foreignKey);

                    return Model.collection.where(hash)[0];
                },

                // Setter method
                set: function (model, options) {
                    return model.set(foreignKey, this.id, options);
                },

                // Builder method
                build: function (attributes, options) {
                    // Attributes hash
                    var hash = this._makeHash(attributes, foreignKey);

                    return new Model(hash, options);
                },

                // Creator method
                create: function (attributes, options) {
                    // Attributes hash
                    var hash = this._makeHash(attributes, foreignKey);

                    return Model.collection.create(hash, options);
                }
            }, options);
        },

        hasMany: function (Model, options) {
            // Foreign key
            var foreignKey = options.foreignKey;

            // Create reference methods
            return this._createReference(Model, {
                // Getter method
                get: function () {
                    // Collection of related models
                    var RelatedModels = this._RelatedModels,

                        // Attributes hash
                        hash = this._makeHash(null, foreignKey),
                        // Array of related models
                        models = Model.collection.where(hash);

                    return new RelatedModels(models, {
                        model: Model
                    });
                }
            }, options);
        },

        toJSON: _.wrap(Model.prototype.toJSON, function (toJSON, options) {

            ///////////////
            // INSURANCE //
            ///////////////

            // Ensure options
            options = options || {};

            ///////////////

            // Original attributes hash
            var attributes = toJSON.call(this, options),

                // Add current model to the options
                callerOptions = _.extend({}, options, {
                    caller: this
                });

            // Include related data into JSON
            if (options.parse) {
                _.each(this._relations, function (relation, attribute) {
                    // Related model
                    var Model = relation.Model, data;

                    // Prevent circular dependency
                    if (!(options.caller instanceof Model)) {
                        // Get related data
                        data = relation.reference.get.call(this);

                        // Overwrite attribute with related JSON
                        attributes[attribute] = data.toJSON(callerOptions);
                    }

                    // Remove "foreignKey" attribute from JSON
                    delete attributes[relation.options.foreignKey];
                }, this);
            }

            return attributes;
        }),

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
            return this._addRelation(Model, reference, options);
        },

        _addRelation: function (Model, reference, options) {
            // Add relation hash
            this._relations[options.as] = {
                Model: Model,
                reference: reference,
                options: options
            };

            return this;
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
