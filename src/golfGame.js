var shortid = require('shortid');

class golfGame {
    createGame() {
        return shortid.generate();
    }
    setScore(gameId, user, hole, score) {

    }
    getGameScore(gameId) {
        return gameId;
    }
}
module.exports = golfGame;