'use strict';

const shortid = require('shortid');

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

function gameExists(tablename, gameId, cb) {
  const params = {
    TableName: tablename,
    KeyConditionExpression: '#id = :gameId',
    ExpressionAttributeNames: {
      '#id': 'gameId',
    },
    ExpressionAttributeValues: {
      ':gameId': gameId,
    },
    Limit: 1,
  };

  dynamo.query(params, (err, data) => {
    if (err) {
      console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
      cb(err, false);
    } else {
      console.log('Query succeeded.');
      console.log(data.Items);
      cb(null, data.Items.length > 0);
    }
  });
}

function addNewGame(tablename, item, cb) {
  gameExists(tablename, item.gameId, (err, exists) => {
    console.log('add a new one', exists);
    console.log('err', err);
    let gameId = item.gameId;
    if (exists) {
      console.log('id exists, new id');
      gameId = shortid.generate();
    }
    console.log('put');
    const params = {
      TableName: tablename,
      Item: { gameId },
    };
    dynamo.put(params, (error, data) => {
      console.log('data', data);
      console.log('error', error);
      if (err) {
        cb({ err: 'error' }, data);
      } else {
        cb(null, { gameId: item.gameId });
      }
    });
  });
}

function getGameScores(tablename, gameId, cb) {
  const params = {
    TableName: tablename,
    ProjectionExpression: '#id, #user, hole, score',
    KeyConditionExpression: '#id = :gameId',
    ExpressionAttributeNames: {
      '#id': 'gameId',
      '#user': 'user',
    },
    ExpressionAttributeValues: {
      ':gameId': gameId,
    },
  };

  dynamo.query(params, (err, data) => {
    if (err) {
      console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
      cb(err, null);
    } else {
      console.log(data);
      console.log(data.Items);
      console.log('Query succeeded.');
      cb(null, data.Items);
    }
  });
}

module.exports.setscore = (event, context, cb) => {
  const stage = event.stage || 'dev';
  const tablename = `${stage}-game-table`;
  const input = {};
  input.gameId = event.path.gameId;
  input.hole = parseInt(event.path.hole, 10);
  input.score = parseInt(event.path.score, 10);
  input.user = event.path.user;
  input.userandhole = `${input.user}:${input.hole}`;
  console.log('data out', input);
  const params = {
    TableName: tablename,
    Item: input,
  };

  dynamo.put(params, (err, returnData) => {
    console.log('data', returnData);
    console.log('err', err);
    if (err) {
      cb(err, returnData);
    } else {
      getGameScores(tablename, input.gameId, (returnScoreErr, returnScoreData) => {
        console.log('err', returnScoreErr);
        if (err) {
          cb({ err: 'error' }, returnScoreData);
        } else {
          cb(null, { score: returnScoreData, input });
        }
      });
    }
  });
};

module.exports.getgamescore = (event, context, cb) => {
  const stage = event.stage || 'dev';
  const tablename = `${stage}-game-table`;
  const input = {};
  input.gameId = event.path.gameId;
  getGameScores(tablename, input.gameId, (err, returnData) => {
    console.log('err', err);
    if (err) {
      cb({ err: 'error' }, returnData);
    } else {
      cb(null, { score: returnData, input });
    }
  });
};

module.exports.creategame = (event, context, cb) => {
  const gameId = shortid.generate();
  const stage = event.stage || 'dev';
  const tablename = `${stage}-game-table`;
  console.log(tablename);
  const item = {
    gameId,
    userandhole: `${event.path.user}:1`,
  };

  addNewGame(tablename, item, cb);
};

