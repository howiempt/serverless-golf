var assert = require('assert');
var golfGame = require('../src/golfGame');
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;

describe('golfGame', function() {
  describe('createGame', function() {
    it('should return random id', function() {        
      var gameId = new golfGame().createGame();
      expect(gameId).to.not.be.empty;
    });
  });
  describe('setScore', function() {
    it('should set score', function() {
      var score = new golfGame().setScore('matt', 1, 4);
    });
  });
  describe('getGameScore', function() {
    it('should return score', function() {
      var score = new golfGame().getGameScore('1234');
    });
  });
});