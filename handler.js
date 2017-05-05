'use strict';

var golfGame = require('./src/golfGame.js');

module.exports.setscore = (event, context, cb) => {
    cb(null, { message: 'set game score', event });
};

module.exports.getgamescore = (event, context, cb) =>{
    cb(null, { message: 'get game score', event });
};

module.exports.creategame = (event, context, cb) => {
    cb(null, { gameId: (new golfGame()).createGame() });
};

