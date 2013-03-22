$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var Model = Backbone.Model.extend(),

        Collection = Backbone.Collection.extend({
            model: Model
        });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.Collection (Relations)', {
        setup: function () {
            this.collection = new Collection();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('static reference', function () {
        strictEqual(Model.collection, this.collection);
    });
});
