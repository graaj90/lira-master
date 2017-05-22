'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transactions = exports.users = undefined;

var _nedbPromise = require('nedb-promise');

var _nedbPromise2 = _interopRequireDefault(_nedbPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = exports.users = new _nedbPromise2.default();
var transactions = exports.transactions = new _nedbPromise2.default();