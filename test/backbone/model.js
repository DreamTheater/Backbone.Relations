$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var User = Backbone.Model.extend({
            initialize: function () {
                this.hasOne(Mailbox, { as: 'mailbox', foreignKey: 'userId' });
            }
        }),

        Mailbox = Backbone.Model.extend({
            initialize: function () {
                this.belongsTo(User, { as: 'user', foreignKey: 'userId' });
                this.hasMany(Message, { as: 'messages', foreignKey: 'mailboxId' });
            }
        }),

        Message = Backbone.Model.extend({
            initialize: function () {
                this.belongsTo(Mailbox, { as: 'mailbox', foreignKey: 'mailboxId' });
            }
        }),

        UserList = Backbone.Collection.extend({
            model: User
        }),

        MailboxList = Backbone.Collection.extend({
            model: Mailbox
        }),

        MessageList = Backbone.Collection.extend({
            model: Message
        });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.Model (Relations)', {
        setup: function () {
            this.userList = new UserList([
                { id: 1, name: 'Dmytro Nemoga' },
                { id: 2, name: 'Andriy Serputko' }
            ]);

            this.mailboxList = new MailboxList([
                { id: 1, email: 'dnemoga@gmail.com', userId: 1 },
                { id: 2, email: 'aserput@gmail.com', userId: 2 }
            ]);

            this.messageList = new MessageList([
                { id: 1, text: 'Hi, Dmytro! How are you?', mailboxId: 1 },
                { id: 2, text: 'Hi, Andriy! I\'m fine, thanks!', mailboxId: 2 }
            ]);
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('test', function () {
        ok(true);
    });
});
