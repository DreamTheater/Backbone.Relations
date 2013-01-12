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

    module('Backbone.Associations', {
        setup: function () {
            this.users = new Users([{
                id: 1,
                name: 'James Nix'
            }, {
                id: 2,
                name: 'Bart Wood'
            }]);

            this.mailboxes = new Mailboxes([{
                id: 1,
                email: 'jnix@gmail.com',
                userId: 1
            }, {
                id: 2,
                email: 'bwood@gmail.com',
                userId: 2
            }]);

            this.messages = new Messages([{
                id: 1,
                body: 'Hello, Bart!',
                mailboxId: 1
            }, {
                id: 2,
                body: 'Hello, James!',
                mailboxId: 2
            }]);
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('toJSON with associations', 6, function () {
        deepEqual(this.users.toJSON(), [{
            id: 1,
            name: 'James Nix'
        }, {
            id: 2,
            name: 'Bart Wood'
        }]);

        deepEqual(this.users.toJSON({
            associations: true
        }), [{
            id: 1,
            name: 'James Nix',

            mailbox: {
                id: 1,
                email: 'jnix@gmail.com',

                messages: [{
                    id: 1,
                    body: 'Hello, Bart!'
                }]
            }
        }, {
            id: 2,
            name: 'Bart Wood',

            mailbox: {
                id: 2,
                email: 'bwood@gmail.com',

                messages: [{
                    id: 2,
                    body: 'Hello, James!'
                }]
            }
        }]);

        deepEqual(this.mailboxes.toJSON(), [{
            id: 1,
            email: 'jnix@gmail.com',
            userId: 1
        }, {
            id: 2,
            email: 'bwood@gmail.com',
            userId: 2
        }]);

        deepEqual(this.mailboxes.toJSON({
            associations: true
        }), [{
            id: 1,
            email: 'jnix@gmail.com',

            user: {
                id: 1,
                name: 'James Nix'
            },

            messages: [{
                id: 1,
                body: 'Hello, Bart!'
            }]
        }, {
            id: 2,
            email: 'bwood@gmail.com',

            user: {
                id: 2,
                name: 'Bart Wood'
            },

            messages: [{
                id: 2,
                body: 'Hello, James!'
            }]
        }]);

        deepEqual(this.messages.toJSON(), [{
            id: 1,
            body: 'Hello, Bart!',
            mailboxId: 1
        }, {
            id: 2,
            body: 'Hello, James!',
            mailboxId: 2
        }]);

        deepEqual(this.messages.toJSON({
            associations: true
        }), [{
            id: 1,
            body: 'Hello, Bart!',

            mailbox: {
                id: 1,
                email: 'jnix@gmail.com',

                user: {
                    id: 1,
                    name: 'James Nix'
                }
            }
        }, {
            id: 2,
            body: 'Hello, James!',

            mailbox: {
                id: 2,
                email: 'bwood@gmail.com',

                user: {
                    id: 2,
                    name: 'Bart Wood'
                }
            }
        }]);
    });
});
