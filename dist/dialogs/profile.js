'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _bot = require('../controllers/bot');

var _bot2 = _interopRequireDefault(_bot);

var _regex = require('../util/regex');

var _handleSponsoredDialog = require('../util/handle-sponsored-dialog');

var _handleSponsoredDialog2 = _interopRequireDefault(_handleSponsoredDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A waterfall dialog function that will verify if a users profile
 * is setup or not. if it is not then it will trigger the `/profile`
 * dialog to kick in before continuing on the original dialog
 * @param  {Object}   session botbuilder session
 * @param  {Object}   args    context passed into the dialog
 * @param  {Function} next    middleware like next function to continue to the next waterfall
 */
var verifyUserProfile = function verifyUserProfile(session, args, next) {
  if (!session.message.ctx.user.isSetup()) {
    session.beginDialog('/profile');
  } else {
    next();
  }
};

_bot2.default.dialog('/', [verifyUserProfile, function (session) {
  session.send('\n        Hello, ' + session.message.ctx.user.firstName + ',\n        There a few commands that you can ask me:\n        - can i buy (something)\n        - get balance\n        - set balance\n        - update name\n      ');
}]);

_bot2.default.dialog('/profile/name', [
// updates users information
function (session) {
  session.message.utu.event('Update Profile Name');
  _botbuilder2.default.Prompts.text(session, 'Okay great! let\'s update your name. What is your first name?');
},
// set the users firstName and asks for the last name
function (session, results) {
  if (results.response) {
    session.message.ctx.user.setFirstName(results.response);
  }

  _botbuilder2.default.Prompts.text(session, 'What is your last name?');
},

// set the lastName and updates the utu profile, but just the first and last name
function (session, results) {
  if (results.response) {
    session.message.ctx.user.setLastName(results.response);
  }
  var _session$message$ctx$ = session.message.ctx.user,
      firstName = _session$message$ctx$.firstName,
      lastName = _session$message$ctx$.lastName;


  session.message.utu.user({ values: { firstName: firstName, lastName: lastName } });

  session.send('Alright, you should be good to go! I\'ll now call you ' + firstName + ' ' + lastName);
  session.endDialog();
}]).triggerAction({ matches: /(change|set|update).*name/i });

_bot2.default.dialog('/profile', [
// starts the dialog letting the user know we need to collect some information
function (session, args, next) {
  session.message.utu.event('Setup Profile');
  if (!session.message.ctx.user.email) {
    _botbuilder2.default.Prompts.text(session, 'Hi, I just need to collect a few pieces of information from you since this is our first time talking! What is your email?');
    session.message.utu.intent('initial-setup').then((0, _handleSponsoredDialog2.default)(session)).catch(function (e) {
      return console.log(e);
    });
  } else {
    next();
  }
},

// checks for existing identities and will merge them
// update utu and end the dialog, if we don't have an identity
// then the user is new and we need to continue with the dialog
function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(session, results, next) {
    var emails, email, restored;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!results.response) {
              _context.next = 9;
              break;
            }

            emails = (0, _regex.getEmail)(results.response);
            email = emails[0] && emails[0].toLowerCase();

            // if we didn't find an email do nothing so the bot will ask again

            if (email) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return');

          case 5:
            _context.next = 7;
            return session.message.ctx.user.restoreUserFromEmail(email);

          case 7:
            restored = _context.sent;


            if (restored) {
              // let the user know we have identitied them from another platform
              session.send('Oh, hi ' + session.message.ctx.user.firstName + ', Its good to see you again. I\'ve synced your accounts now');

              session.message.utu.intent('cross-channel-identified').then((0, _handleSponsoredDialog2.default)(session)).catch(function (e) {
                return console.log(e);
              });

              // update the users information in utu
              session.message.ctx.user.saveUTU();

              // end the dialog because we don't need to collect any other information from the user
              session.endDialog();
            } else {
              // set the users email
              session.message.ctx.user.setEmail(email);
            }

          case 9:

            if (!session.message.ctx.user.firstName) {
              _botbuilder2.default.Prompts.text(session, 'What is your first name?');
            } else {
              next();
            }

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}(),

// sets the first name and asks for a last name
function (session, results, next) {
  if (results.response) {
    session.message.ctx.user.setFirstName(results.response);
  }

  if (!session.message.ctx.user.lastName) {
    _botbuilder2.default.Prompts.text(session, 'What is your last name?');
  } else {
    next();
  }
},

// sets the last name and asks for a balance
function (session, results, next) {
  if (results.response) {
    session.message.ctx.user.setLastName(results.response);
  }

  if (!session.message.ctx.user.balance) {
    _botbuilder2.default.Prompts.number(session, 'What is your starting balance?');
  } else {
    next();
  }
},

// end of dialog this should finish the account setup
// and update the utu profile
function (session, results) {
  if (results.response) {
    session.message.ctx.user.setBalance(results.response);
    session.message.ctx.user.setSetup();
  }

  // update the users information in utu
  session.message.ctx.user.saveUTU();
  session.message.utu.event('Profile Setup');
  session.endDialog();
}]);

exports.default = verifyUserProfile;