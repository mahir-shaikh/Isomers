"use strict";

(function(module) {
  var plugin = function(hc, nf) {
    hc.wrap(hc, 'formatSingle', function(originalFormat, format, value) {
      var formatStr, scaler;
      if (format) {
        if (format.indexOf('date') === -1 && format.indexOf(':') !== -1) {
          formatStr = format.split(':')[0];
          scaler = Number(format.split(':')[1]) || 1;
        } else {
          formatStr = format;
          scaler = 1;
        }
        return nf.format(value, formatStr, scaler);
      } else {
        return value;
      }
    });
  };
  module.exports = plugin;
})(module);
