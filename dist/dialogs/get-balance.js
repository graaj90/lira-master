'use strict';

var _bot = require('../controllers/bot');

var _bot2 = _interopRequireDefault(_bot);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

var _handleSponsoredDialog = require('../util/handle-sponsored-dialog');

var _handleSponsoredDialog2 = _interopRequireDefault(_handleSponsoredDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bot2.default.dialog('/get-balance', [_profile2.default, function (session) {
  session.send('Your current balance is $%s!', session.message.ctx.user.balance);
  session.message.utu.intent('get-balance').then((0, _handleSponsoredDialog2.default)(session)).catch(function (e) {
    return console.log(e);
  });
}]).triggerAction({ matches: /(get|see|view|show).*balance/i });