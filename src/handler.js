'use strict';

const shortid = require('shortid');

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

function returnData(statusCode, data) {
  return { statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data) };
}

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
      Item: {
        gameId,
        userandhole: item.userandhole,
        user: item.user,
        score: 0,
        hole: item.hole,
      },
    };
    dynamo.put(params, (error, data) => {
      if (error) {
        console.log('error', error);
        cb(null, returnData(400, { error }));
      } else {
        console.log('data', data);
        cb(null, returnData(200, { gameId: item.gameId }));
      }
    });
  });
}

function getGameScores(tablename, gameId, eventId, cb) {
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
      cb(null, { Items: data.Items, EventId: eventId });
    }
  });
}

module.exports.setscore = (event, context, cb) => {
  console.log(event);
  const stage = event.stage || 'dev';
  const tablename = `${stage}-game-table`;
  const input = {};
  const pathInput = event.pathParameters || event.path;
  input.gameId = pathInput.gameId;
  input.hole = parseInt(pathInput.hole, 10);
  input.score = parseInt(pathInput.score, 10);
  input.user = pathInput.user;
  input.userandhole = `${input.user}:${input.hole}`;
  console.log('data out', input);
  const params = {
    TableName: tablename,
    Item: input,
    EventId: event.query.ts || '',
  };

  dynamo.put(params, (error, resultData) => {
    console.log('data', resultData);
    console.log('err', error);
    if (error) {
      cb(null, returnData(400, { error }));
    } else {
      getGameScores(tablename, input.gameId, params.EventId, (returnScoreErr, returnScoreData) => {
        console.log('returnScoreErr', returnScoreErr);
        if (returnScoreErr) {
          cb(null, returnData(400, { error: returnScoreErr }));
        } else {
          cb(null, returnData(200, { score: returnScoreData }));
        }
      });
    }
  });
};

module.exports.getgamescore = (event, context, cb) => {
  console.log(event);
  const stage = event.stage || 'dev';
  const tablename = `${stage}-game-table`;
  const input = {};
  const pathInput = event.pathParameters || event.path;
  input.gameId = pathInput.gameId;
  getGameScores(tablename, input.gameId, event.query.ts || '', (err, getData) => {
    console.log('err', err);
    if (err) {
      cb(null, returnData(400, { error: err }));
    } else {
      cb(null, returnData(200, { score: getData }));
    }
  });
};

module.exports.creategame = (event, context, cb) => {
  console.log(event);
  const gameId = shortid.generate();
  const stage = event.stage || 'dev';
  const tablename = `${stage}-game-table`;
  const pathInput = event.pathParameters || event.path;
  console.log(tablename);
  const item = {
    gameId,
    userandhole: `${pathInput.user}:1`,
    user: pathInput.user,
    hole: 1,
  };
  console.log(item);
  addNewGame(tablename, item, cb);
};

