'use strict';

var _ = require('highland');

module.exports = function(f, cases) {
  var g = typeof f === 'string' ? function(x) { return x[f]; } : f
    , streams = {};

  for (var c in cases) {
    if (cases.hasOwnProperty(c)) {
      streams[c] = _(cases[c]);
    }
  }

  function writeAll(x) {
    for (var c in streams) {
      if (streams.hasOwnProperty(c)) {
        streams[c].write(x);
      }
    }
  }

  function pipeAll(dest) {
    for (var c in streams) {
      if (streams.hasOwnProperty(c)) {
        streams[c].pipe(dest);
      }
    }
  }

  function when(s) {
    var rest = s.consume(function(err, x, push, next) {
      if (err) {
        push(err);
        next();
      } else if (x === _.nil) {
        writeAll(_.nil);
        push(null, _.nil);
      } else {
        var v = g(x);
        if (streams.hasOwnProperty(v)) {
          streams[v].write(x);
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
  }

  return _.pipeline(when);
};
