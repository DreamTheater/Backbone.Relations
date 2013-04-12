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
         * @constructor
         */
        constructor: function (models, options) {
            /**
             * @override
             */
            this.initialize = _.wrap(this.initialize, function (initialize, models, options) {

                /////////////////
                // DEFINITIONS //
                /////////////////

                this.model.collection = this;

                /////////////////

                return initialize.call(this, models, options);
            });

            Collection.call(this, models, options);
        }
    });
}());
