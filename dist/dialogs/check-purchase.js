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

_bot2.default.dialog('/check-purchase', [_profile2.default, function (session) {
  session.message.utu.event('Check Purchase');
  _botbuilder2.default.Prompts.number(session, 'How much does it cost?');
}, function (session, results) {
  if (results.response) {
    var b = session.message.ctx.user.balance;
    var r = b - results.response;
    if (r >= 0) {
      session.dialogData.remainingBalance = r;
      _botbuilder2.default.Prompts.confirm(session, 'Yes you can! and you\'d still have $' + r + ' left! Would you like me to update your balance?');
      session.message.utu.event('Can Purchase');
    } else {
      session.message.utu.event('Cannot Purchase');
      session.send('No, sorry you are about $' + Math.abs(r) + ' short of being able to make that purchase.');
      session.endDialog();
    }
  }
}, function (session, results) {
  if (results.response) {
    session.message.ctx.user.setBalance(session.dialogData.remainingBalance);
    session.message.utu.user({ values: { balance: session.dialogData.remainingBalance } });
    session.send('Will do! Your new account balance is $' + session.message.ctx.user.balance);
  } else {
    session.send('Okay, let me know if you change your mind. Your account balance is still $' + session.message.ctx.user.balance);
  }

  session.message.utu.intent('check-purchase-can-purchase').then((0, _handleSponsoredDialog2.default)(session)).catch(function (e) {
    return console.log(e);
  });

  session.endDialog();
}]).triggerAction({ matches: /(can i)/i }).cancelAction('cancelItemAction', 'Okay, don\'t be afraid to ask again!', { matches: /(cancel|stop|nvm|quit)/i });