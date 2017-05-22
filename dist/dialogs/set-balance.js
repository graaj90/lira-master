'use strict';

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _bot = require('../controllers/bot');

var _bot2 = _interopRequireDefault(_bot);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

var _handleSponsoredDialog = require('../util/handle-sponsored-dialog');

var _handleSponsoredDialog2 = _interopRequireDefault(_handleSponsoredDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bot2.default.dialog('/set-balance', [_profile2.default, function (session) {
  _botbuilder2.default.Prompts.number(session, 'What is your new balance?');
}, function (session, results) {
  if (results.response) {
    session.message.ctx.user.setBalance(results.response);
  }
  session.send('Your current balance is $%s!', session.message.ctx.user.balance);
  session.message.utu.intent('get-balance').then((0, _handleSponsoredDialog2.default)(session)).catch(function (e) {
    return console.log(e);
  });
  session.endDialog();
}]).triggerAction({ matches: /(set).*balance/i }).cancelAction('cancelItemAction', 'Okay, don\'t be afraid to ask again!', { matches: /(cancel|stop|nvm|quit)/i });