'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utu = exports.mapPlatformToUTUNames = undefined;

var _utu = require('utu');

var UTU_SECRET = process.env.UTU_SECRET;


var platformMatrix = {
  sms: _utu.constants.SMS,
  facebook: _utu.constants.MESSENGER,
  kik: _utu.constants.KIK,
  slack: _utu.constants.SLACK
};

var mapPlatformToUTUNames = exports.mapPlatformToUTUNames = function mapPlatformToUTUNames(platform) {
  return platformMatrix[platform] || platformMatrix.kik;
};

// create our utu client
var utu = exports.utu = new _utu.uTu(UTU_SECRET);

exports.default = {
  receive: function receive(session, next) {
    // console.log('RECIEVE: ', JSON.stringify(session, null, 2));
    var ctx = utu.withContext({
      platform: mapPlatformToUTUNames(session.address.channelId),
      platformId: session.user.id
    });

    ctx.message({
      values: {
        message: session.text,
        rawMessage: session.sourceEvent || session,
        botMessage: false
      }
    }).catch(function (e) {
      return console.log('UTU MSG Receive ERROR:', e);
    });

    Object.assign(session, { utu: ctx });

    next();
  },
  send: function send(session, next) {
    // console.log('SEND: ', JSON.stringify(session, null, 2));
    utu.message({
      platform: mapPlatformToUTUNames(session.address.channelId),
      platformId: session.address.user.id,
      values: {
        message: session.text || '',
        rawMessage: session.sourceEvent || session,
        botMessage: true
      }
    }).catch(function (e) {
      return console.log('UTU MSG Send ERROR:', e);
    });
    next();
  }
};