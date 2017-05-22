'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _collections = require('../collections');

var _utu = require('../middlewares/utu');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = function () {
  function User(platform, platformId) {
    (0, _classCallCheck3.default)(this, User);

    this.platformId = platformId;
    this.platform = platform;
    this.identity = [this.getActiveIdentity()];
  }

  /**
   * Gets a users identity key pair
   * @return {Object} identity key pair
   */


  (0, _createClass3.default)(User, [{
    key: 'getActiveIdentity',
    value: function getActiveIdentity() {
      return { platform: this.platform, platformId: this.platformId };
    }

    /**
     * Fetches a user from the database and loads the users information
     */

  }, {
    key: 'fetchUser',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var identity, user, isNew;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                identity = this.getActiveIdentity();
                _context.next = 4;
                return _collections.users.findOne({ identity: identity });

              case 4:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 7;
                  break;
                }

                _context.t0 = {};

              case 7:
                user = _context.t0;
                isNew = !user.identity;

                this._id = user._id;
                this.identity = user.identity || [identity];
                this.balance = user.balance || 0.00;
                this.firstName = user.firstName || '';
                this.lastName = user.lastName || '';
                this.email = user.email || '';
                this.setup = !!user.setup;

                // if we have a new user save them to the db

                if (!isNew) {
                  _context.next = 19;
                  break;
                }

                _context.next = 19;
                return this.saveUserRecord();

              case 19:
                return _context.abrupt('return', user);

              case 22:
                _context.prev = 22;
                _context.t1 = _context['catch'](0);

                console.log(_context.t1);

              case 25:
                return _context.abrupt('return', false);

              case 26:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 22]]);
      }));

      function fetchUser() {
        return _ref.apply(this, arguments);
      }

      return fetchUser;
    }()

    /**
     * Saves a users complete record to the database
     * @return {Promise}
     */

  }, {
    key: 'saveUserRecord',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(query) {
        var identity;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                identity = this.getActiveIdentity();
                _context2.prev = 1;
                return _context2.abrupt('return', _collections.users.update(query || { identity: identity }, {
                  $set: {
                    identity: this.identity,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    balance: this.balance,
                    email: this.email,
                    setup: this.setup
                  }
                }, { upsert: true }));

              case 5:
                _context2.prev = 5;
                _context2.t0 = _context2['catch'](1);

                console.log('save user record error: ', _context2.t0);
                return _context2.abrupt('return', false);

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 5]]);
      }));

      function saveUserRecord(_x) {
        return _ref2.apply(this, arguments);
      }

      return saveUserRecord;
    }()

    /**
     * Merges to records into one by identifying a user from
     * another platform using their email
     * @param  {String}  email the users email
     * @return {Promise}
     */

  }, {
    key: 'restoreUserFromEmail',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(email) {
        var identity, user, currentExist;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                identity = this.getActiveIdentity();
                _context3.next = 4;
                return _collections.users.findOne({ email: email, identity: { $ne: identity } });

              case 4:
                user = _context3.sent;

                if (!user) {
                  _context3.next = 18;
                  break;
                }

                // remove the old records so we can create a new one
                _collections.users.remove({ _id: user._id });
                _collections.users.remove({ _id: this._id });

                // check if the current user already had an identity record for this platform
                currentExist = !!(0, _lodash.find)(user ? user.identity : [], identity);

                // merge identities the user found doesn't already have this current
                // active identity record

                this.identity = currentExist ? user.identity : [].concat((0, _toConsumableArray3.default)(user.identity || []), [identity]);
                this.balance = user.balance;
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.email = user.email;
                this.setup = !!user.setup;

                // update the users record so that the next request we will have all identity
                // profiles saved for the user, normally we would only update the keys
                // that are updated, but in this case we want to ensure everything is updated
                _context3.next = 17;
                return this.saveUserRecord({ email: email });

              case 17:
                return _context3.abrupt('return', true);

              case 18:
                return _context3.abrupt('return', false);

              case 21:
                _context3.prev = 21;
                _context3.t0 = _context3['catch'](0);

                console.log(_context3.t0);
                return _context3.abrupt('return', false);

              case 25:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 21]]);
      }));

      function restoreUserFromEmail(_x2) {
        return _ref3.apply(this, arguments);
      }

      return restoreUserFromEmail;
    }()

    /**
     * Updates a users information
     * @param  {Object}  $set values to be set
     * @return {Promise}
     */

  }, {
    key: 'update',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4($set) {
        var identity;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                identity = this.getActiveIdentity();
                _context4.prev = 1;
                _context4.next = 4;
                return _collections.users.update({ identity: identity }, { $set: $set }, { upsert: true });

              case 4:
                _context4.next = 9;
                break;

              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4['catch'](1);

                console.log('save error: ', _context4.t0);

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 6]]);
      }));

      function update(_x3) {
        return _ref4.apply(this, arguments);
      }

      return update;
    }()

    /**
     * Updates a users balance
     * @param {String} balance the new balance
     */

  }, {
    key: 'setBalance',
    value: function setBalance(balance) {
      this.balance = parseFloat(balance);
      // update utu
      this.saveUTU({ balance: this.balance });
      return this.update({ balance: balance });
    }

    /**
     * Sets a users firstname
     * @param {String} firstName the users firstName
     */

  }, {
    key: 'setFirstName',
    value: function setFirstName(firstName) {
      this.firstName = firstName;
      return this.update({ firstName: firstName });
    }

    /**
     * Sets a users lastName
     * @param {String} lastName the users lastName
     */

  }, {
    key: 'setLastName',
    value: function setLastName(lastName) {
      this.lastName = lastName;
      return this.update({ lastName: lastName });
    }

    /**
     * Sets a users email
     * @param {String} email the users email
     */

  }, {
    key: 'setEmail',
    value: function setEmail(email) {
      this.email = email;
      return this.update({ email: email });
    }

    /**
     * Sets the setup flag to true
     */

  }, {
    key: 'setSetup',
    value: function setSetup() {
      this.setup = true;
      return this.update({ setup: this.setup });
    }

    /**
     * Pushes a users information to utu
     * @return {[type]} [description]
     */

  }, {
    key: 'saveUTU',
    value: function saveUTU(values) {
      _utu.utu.user({
        platform: this.platform,
        platformId: this.platformId,
        values: values || {
          firstName: this.firstName,
          lastName: this.lastName,
          balance: this.balance,
          email: this.email
        }
      }).catch(function (e) {
        return console.log(e);
      });
    }

    /**
     * Checks if a user is setup
     * @return {Boolean} is the users account complete or not
     */

  }, {
    key: 'isSetup',
    value: function isSetup() {
      return this.setup;
    }
  }]);
  return User;
}();

exports.default = User;