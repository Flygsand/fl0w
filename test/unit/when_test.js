'use strict';

var expect = require('chai').expect
  , _ = require('highland')
  , when = require('../../when');

describe('when', function() {
  it('filters property names', function(done) {
    _([
      {
        type: 'bar',
        msg: 'hello'
      },
      {
        type: 'baz',
        msg: 'goodbye'
      }
    ])
    .pipe(when('type', {
      'bar': _.pipeline(_.doto(function(x) {
        x.msg = x.msg.toUpperCase();
      }))
    }))
    .toArray(function(xs) {
      expect(xs).to.eql([
        {
          type: 'bar',
          msg: 'HELLO'
        },
        {
          type: 'baz',
          msg: 'goodbye'
        }
      ]);
      done();
    });
  });

  it('filters using a function', function(done) {
    function f(x) {
      return x.type;
    }

    _([
      {
        type: 'bar',
        msg: 'hello'
      },
      {
        type: 'baz',
        msg: 'goodbye'
      }
    ])
    .pipe(when(f, {
      'bar': _.pipeline(_.doto(function(x) {
        x.msg = x.msg.toUpperCase();
      }))
    }))
    .toArray(function(xs) {
      expect(xs).to.eql([
        {
          type: 'bar',
          msg: 'HELLO'
        },
        {
          type: 'baz',
          msg: 'goodbye'
        }
      ]);
      done();
    });
  });

  it('passes errors along', function(done) {
    var err;

    function test() {
      _([
        {
          type: 'bar',
          msg: 'hello'
        }
      ])
      .pipe(when('type', {
        'bar': _.pipeline(_.doto(function(x) {
          throw new Error('oh no');
        }))
      }))
      .errors(function(e) { err = e; })
      .done(done);
    }

    expect(test).to.not.throw(Error);
    expect(err).to.eql(new Error('oh no'));
  });
});
