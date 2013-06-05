$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var Model = Backbone.Model, Collection = Backbone.Collection;

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
