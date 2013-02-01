[lnk]: https://travis-ci.org/DreamTheater/Backbone.Relations
[img]: https://secure.travis-ci.org/DreamTheater/Backbone.Relations.png

# Backbone.Relations [![Build Status][img]][lnk]
The plugin is for defining relations between models.

**Dependencies:**

  - [Backbone](https://github.com/documentcloud/backbone) `>= 0.9.10`
  - [Underscore](https://github.com/documentcloud/underscore) `>= 1.4.4`
  - [Underscore.String](https://github.com/epeli/underscore.string) `>= 2.3.0`

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
var Users = Backbone.Collection.extend({
        model: User
    }),

    Mailboxes = Backbone.Collection.extend({
        model: Mailbox
    }),

    Messages = Backbone.Collection.extend({
        model: Message
    });
```

### Create collections
```js
var users = new Users([{
        id: 1,
        name: 'Dmytro Nemoga'
    }, {
        id: 2,
        name: 'Andriy Serputko'
    }]),

    mailboxes = new Mailboxes([{
        id: 1,
        email: 'dnemoga@gmail.com',
        userId: 1
    }, {
        id: 2,
        email: 'aserput@gmail.com',
        userId: 2
    }]),

    messages = new Messages([{
        id: 1,
        body: 'Hello, Dmytro!',
        mailboxId: 1
    }, {
        id: 2,
        body: 'Hello, Andriy!',
        mailboxId: 2
    }]);
```

## Changelog
### 0.1.1
  - Removed `model.toJSON` method

### 0.1.0
  - Initial release
