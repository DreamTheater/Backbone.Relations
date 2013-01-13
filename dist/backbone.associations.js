/*!
 * Backbone.Associations v0.1.0
 * https://github.com/DreamTheater/Backbone.Associations
 *
 * Copyright (c) 2013 Dmytro Nemoga
 * Released under the MIT license
 */
(function () {
    'use strict';

    // Superclass
    var Model = Backbone.Model;

    /**
     * @class Backbone.Model
     */
    Backbone.Model = Model.extend({
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

            if (this.collection) {
                // Save instance of a collection as static property
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
                    var hash = this._createHash(null, foreignKey);

                    return Model.collection.where(hash)[0];
                },

                // Setter method
                set: function (model, options) {
                    return model.set(foreignKey, this.id, options);
                },

                // Builder method
                build: function (attributes, options) {
                    // Attributes hash
                    var hash = this._createHash(attributes, foreignKey);

                    return new Model(hash, options);
                },

                // Creator method
                create: function (attributes, options) {
                    // Attributes hash
                    var hash = this._createHash(attributes, foreignKey);

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
                    // Attributes hash
                    var hash = this._createHash(null, foreignKey);

                    return Model.collection.where(hash);
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

            if (options.parse) {
                // Insert related data into JSON
                _.each(this._relations, function (relation, attribute) {
                    // Related model
                    var Model = relation.Model, data;

                    // Prevent circular dependency
                    if (!(options.caller instanceof Model)) {
                        // Get related data
                        data = relation.reference.get.call(this);
                        // Parse related data
                        data = _.isArray(data) ? _.map(data, function (model) {
                            return model.toJSON(callerOptions);
                        }) : data.toJSON(callerOptions);

                        // Insert related data into JSON
                        attributes[attribute] = data;
                    }

                    // Remove a "foreignKey" attribute from JSON
                    delete attributes[relation.options.foreignKey];
                }, this);
            }

            return attributes;
        }),

        _createReference: function (Model, reference, options) {
            // Reference name
            var name = _.string.classify(options.as);

            // Create getEntity() method
            if (reference.get) {
                this['get' + name] = reference.get;
            }

            // Create setEntity(model, options) method
            if (reference.set) {
                this['set' + name] = reference.set;
            }

            // Create buildEntity(attributes, options) method
            if (reference.build) {
                this['build' + name] = reference.build;
            }

            // Create createEntity(attributes, options) method
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

        _createHash: function (attributes, foreignKey) {
            // Original attributes hash
            var hash = _.clone(attributes) || {};

            // Put "foreignKey" attribute into hash
            hash[foreignKey] = this.id;

            return hash;
        }
    });
}());
