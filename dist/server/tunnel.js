'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localtunnel = require('localtunnel');

var _localtunnel2 = _interopRequireDefault(_localtunnel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (port, subdomain) {
  (0, _localtunnel2.default)(port, { subdomain: subdomain, host: 'https://bot-tunnel.com' }, function (err, tunnel) {
    if (err) {
      console.error('Error Starting Tunnel: ', err);
    }

    console.log('Started Tunnel On: ', tunnel.url);
  });
};