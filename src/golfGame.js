'use strict';

var shortid = require('shortid');

class golfGame {
    constructor(queue) {
        this.queue = queue;
    }

    createGame() {
        return shortid.generate();
    }
    setScore(gameId, user, hole, score) {
        this.queue.push({event:'setScore',data:{ 
            gameId: gameId, 
            user: user, 
            hole: hole, 
            score: score
         }});
    }
    getGameScore(gameId) {        
        return { 
            gameId: gameId,
            events: this.queue
        };
    }
}
module.exports = golfGame;