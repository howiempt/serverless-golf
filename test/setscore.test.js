var assert = require('assert');
var golfGame = require('../src/golfGame');

describe('golfGame tests', function() {
  describe('golfGame setScore', function() {
    it('should set score', function() {
      var score = new golfGame().setScore('matt', 1, 4);
    });
  });
});