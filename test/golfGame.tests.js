var assert = require('assert');
var golfGame = require('../src/golfGame');
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;

describe('golfGame', function() {
  var queue = new Array();
  var gameId;
  describe('createGame', function() {
    it('should return random id', function() {
      gameId = new golfGame(queue).createGame();
      expect(gameId).to.not.be.empty;
    });
  });
  describe('setScore', function() {
    it('should set score', function() {
      new golfGame(queue).setScore(gameId, 'matt', 1, 4);
      expect(gameId).to.not.be.empty;
      expect(queue[0]).to.not.be.empty;
      expect(queue[0].event).to.be.equal('setScore');
      expect(queue[0].data.gameId).to.be.equal(gameId);
      expect(queue[0].data.user).to.be.equal('matt');
      expect(queue[0].data.hole).to.be.equal(1);
      expect(queue[0].data.score).to.be.equal(4);
    });
  });
  describe('getGameScore', function() {
    it('should return score', function() {
      new golfGame(queue).setScore(gameId, 'matt', 2, 3);
      var score = new golfGame(queue).getGameScore(gameId);
      expect(gameId).to.not.be.empty;
      expect(score).to.not.be.empty;
      expect(score.gameId).to.not.be.empty;
      expect(score.events).to.not.be.empty;
      expect(score.events).to.not.be.empty;
      expect(score.events[0].event).to.be.equal('setScore');
      expect(score.events[0].data.gameId).to.be.equal(gameId);
      expect(score.events[0].data.user).to.be.equal('matt');
      expect(score.events[0].data.hole).to.be.equal(1);
      expect(score.events[0].data.score).to.be.equal(4);
      expect(score.events[1].event).to.be.equal('setScore');
      expect(score.events[1].data.gameId).to.be.equal(gameId);
      expect(score.events[1].data.user).to.be.equal('matt');
      expect(score.events[1].data.hole).to.be.equal(2);
      expect(score.events[1].data.score).to.be.equal(3);
    });
  });
});