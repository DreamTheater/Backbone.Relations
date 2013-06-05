(function () {
    'use strict';

    ////////////////
    // SUPERCLASS //
    ////////////////

    var Collection = Backbone.Collection;

    ////////////////

    /**
     * @class
     */
    Backbone.Collection = Collection.extend({
        /**
         * @class
         */
        model: Backbone.Model,

        /**
         * @constructor
         */
        constructor: function (models, options) {
            /**
             * @override
             */
            this.initialize = _.wrap(this.initialize, function (fn, models, options) {

                ////////////////
                // PROPERTIES //
                ////////////////

                this.model.collection = this;

                ////////////////

                return fn.call(this, models, options);
            });

            Collection.call(this, models, options);
        }
    });
}());
