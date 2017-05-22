'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _utu = require('./utu');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  receive: function receive(session, next) {
    // create a new user object
    var user = new _user2.default((0, _utu.mapPlatformToUTUNames)(session.address.channelId), session.user.id);

    user.fetchUser().then(function () {
      // assign a new user object to the message
      Object.assign(session, { ctx: { user: user } });
      // move on to the next middleware
      next();
    });
  }
};