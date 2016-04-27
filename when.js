'use strict';

var _ = require('highland');

module.exports = function(f, cases) {
  var g = typeof f === 'string' ? function(x) { return x[f]; } : f;

  function writeAll(x) {
    for (var c in cases) {
      if (cases.hasOwnProperty(c)) {
        cases[c].write(x);
      }
    }
  }

  function pipeAll(dest) {
    for (var c in cases) {
      if (cases.hasOwnProperty(c)) {
        cases[c].pipe(dest);
      }
    }
  }

  var when = function(s) {
    var rest = s.consume(function(err, x, push, next) {
      if (err) {
        push(err);
        next();
      } else if (x === _.nil) {
        writeAll(_.nil);
        push(null, _.nil);
      } else {
        var v = g(x);
        if (cases.hasOwnProperty(v)) {
          cases[v].write(x);
        } else {
          push(null, x);
        }
        next();
      }
    });

    var dest = _();
    rest.pipe(dest);
    pipeAll(dest);

    return dest;
  };

  return _.pipeline(when);
};
