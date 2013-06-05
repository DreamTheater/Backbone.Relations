[npm-badge]: https://badge.fury.io/js/backbone.relations.png
[npm-link]: https://badge.fury.io/js/backbone.relations

[travis-badge]: https://secure.travis-ci.org/DreamTheater/Backbone.Relations.png
[travis-link]: https://travis-ci.org/DreamTheater/Backbone.Relations

# Backbone.Relations [![NPM Version][npm-badge]][npm-link] [![Build Status][travis-badge]][travis-link]
The plugin is for defining relations between models.

**Dependencies:**

  - [Backbone](https://github.com/documentcloud/backbone) `>= 1.0.0`
  - [Underscore](https://github.com/documentcloud/underscore) `>= 1.4.4`
  - [Underscore.String](https://github.com/epeli/underscore.string) `>= 2.3.0`

## Reference API
### Backbone.Model
#### Static members
  - Backbone.Collection `collection`

#### Instance members
  - Function `belongsTo(Model, options)`
    - Backbone.Model `Model`
    - Object `options`
      - String `as`
      - String `foreignKey`
  - Function `hasOne(Model, options)`
    - Backbone.Model `Model`
    - Object `options`
      - String `as`
      - String `foreignKey`
  - Function `hasMany(Model, options)`
    - Backbone.Model `Model`
    - Object `options`
      - String `as`
      - String `foreignKey`

## Getting Started
### Define models
```js
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
    });
```

### Define collections
```js
var UserList = Backbone.Collection.extend({
        model: User
    }),

    MailboxList = Backbone.Collection.extend({
        model: Mailbox
    }),

    MessageList = Backbone.Collection.extend({
        model: Message
    });
```

### Create collections
```js
var userList = new UserList([
        { id: 1, name: 'Dmytro Nemoga' },
        { id: 2, name: 'Andriy Serputko' }
    ]),

    mailboxList = new MailboxList([
        { id: 1, email: 'dnemoga@gmail.com', userId: 1 },
        { id: 2, email: 'aserput@gmail.com', userId: 2 }
    ]),

    messageList = new MessageList([
        { id: 1, text: 'Hi, Dmytro! How are you?', mailboxId: 1 },
        { id: 2, text: 'Hi, Andriy! I\'m fine, thanks!', mailboxId: 2 }
    ]);
```

### Manipulate related models
#### Association `hasOne`
```js
var user = userList.get(1);

user.getMailbox();
user.setMailbox();
user.buildMailbox();
user.createMailbox();
```

#### Association `hasMany`
```js
var mailbox = mailboxList.get(1);

mailbox.getMessages();
```

#### Association `belongsTo`
```js
var message = messageList.get(1);

message.getMailbox();
message.setMailbox();
message.buildMailbox();
message.createMailbox();
```

## Changelog
### 0.1.6
  - Removed method `toJSON`

### 0.1.5
  - Removed CommonJS support

### 0.1.4
  - Added CommonJS support

### 0.1.3
  - Option `advanced` of `toJSON` method's renamed to `relations`

### 0.1.2
  - Reverted method `toJSON`

### 0.1.1
  - Removed method `toJSON`

### 0.1.0
  - Initial release
