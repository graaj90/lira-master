'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _utu = require('../middlewares/utu');

var _utu2 = _interopRequireDefault(_utu);

var _user = require('../middlewares/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bot = new _botbuilder2.default.UniversalBot(_connector2.default);

bot.use(_utu2.default);
bot.use(_user2.default);

exports.default = bot;