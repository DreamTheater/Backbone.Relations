$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var User = Backbone.Model.extend({
            initialize: function () {
                this.hasOne(Mailbox, {
                    as: 'mailbox',
                    foreignKey: 'userId'
                });
            }
        }),

        Mailbox = Backbone.Model.extend({
            initialize: function () {
                this.belongsTo(User, {
                    as: 'user',
                    foreignKey: 'userId'
                });

                this.hasMany(Message, {
                    as: 'messages',
                    foreignKey: 'mailboxId'
                });
            }
        }),

        Message = Backbone.Model.extend({
            initialize: function () {
                this.belongsTo(Mailbox, {
                    as: 'mailbox',
                    foreignKey: 'mailboxId'
                });
            }
        }),

        Users = Backbone.Collection.extend({
            model: User
        }),

        Mailboxes = Backbone.Collection.extend({
            model: Mailbox
        }),

        Messages = Backbone.Collection.extend({
            model: Message
        });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.Relations', {
        setup: function () {
            this.users = new Users([{
                id: 1,
                name: 'Dmytro Nemoga'
            }, {
                id: 2,
                name: 'Andriy Serputko'
            }]);

            this.mailboxes = new Mailboxes([{
                id: 1,
                email: 'dnemoga@gmail.com',
                userId: 1
            }, {
                id: 2,
                email: 'aserput@gmail.com',
                userId: 2
            }]);

            this.messages = new Messages([{
                id: 1,
                body: 'Hello, Dmytro!',
                mailboxId: 1
            }, {
                id: 2,
                body: 'Hello, Andriy!',
                mailboxId: 2
            }]);
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('toJSON with relations', function () {
        deepEqual(this.users.toJSON(), [{
            id: 1,
            name: 'Dmytro Nemoga'
        }, {
            id: 2,
            name: 'Andriy Serputko'
        }]);

        deepEqual(this.users.toJSON({ advanced: true }), [{
            id: 1,
            name: 'Dmytro Nemoga',

            mailbox: {
                id: 1,
                email: 'dnemoga@gmail.com',

                messages: [{
                    id: 1,
                    body: 'Hello, Dmytro!'
                }]
            }
        }, {
            id: 2,
            name: 'Andriy Serputko',

            mailbox: {
                id: 2,
                email: 'aserput@gmail.com',

                messages: [{
                    id: 2,
                    body: 'Hello, Andriy!'
                }]
            }
        }]);

        deepEqual(this.mailboxes.toJSON(), [{
            id: 1,
            email: 'dnemoga@gmail.com',
            userId: 1
        }, {
            id: 2,
            email: 'aserput@gmail.com',
            userId: 2
        }]);

        deepEqual(this.mailboxes.toJSON({ advanced: true }), [{
            id: 1,
            email: 'dnemoga@gmail.com',

            user: {
                id: 1,
                name: 'Dmytro Nemoga'
            },

            messages: [{
                id: 1,
                body: 'Hello, Dmytro!'
            }]
        }, {
            id: 2,
            email: 'aserput@gmail.com',

            user: {
                id: 2,
                name: 'Andriy Serputko'
            },

            messages: [{
                id: 2,
                body: 'Hello, Andriy!'
            }]
        }]);

        deepEqual(this.messages.toJSON(), [{
            id: 1,
            body: 'Hello, Dmytro!',
            mailboxId: 1
        }, {
            id: 2,
            body: 'Hello, Andriy!',
            mailboxId: 2
        }]);

        deepEqual(this.messages.toJSON({ advanced: true }), [{
            id: 1,
            body: 'Hello, Dmytro!',

            mailbox: {
                id: 1,
                email: 'dnemoga@gmail.com',

                user: {
                    id: 1,
                    name: 'Dmytro Nemoga'
                }
            }
        }, {
            id: 2,
            body: 'Hello, Andriy!',

            mailbox: {
                id: 2,
                email: 'aserput@gmail.com',

                user: {
                    id: 2,
                    name: 'Andriy Serputko'
                }
            }
        }]);
    });
});
