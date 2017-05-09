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
  const data = {};
  data.gameId = event.path.gameId;
  data.hole = parseInt(event.path.hole, 10);
  data.score = parseInt(event.path.score, 10);
  data.user = event.path.user;
  data.userandhole = `${data.user}:{data.hole}`;
  console.log('data out', data);
  const params = {
    TableName: tablename,
    Item: data,
  };

  dynamo.put(params, (err, d) => {
    console.log('data', d);
    console.log('err', err);
    if (err) {
      cb(err, d);
    } else {
      getGameScores(tablename, data.gameId, (ggsErr, ggsData) => {
        console.log('err', ggsErr);
        if (err) {
          cb({ err: 'error' }, ggsData);
        } else {
          cb(null, { score: d, data: ggsData });
        }
      });
    }
  });
};

module.exports.getgamescore = (event, context, cb) => {
  const stage = event.stage || 'dev';
  const tablename = `${stage}-game-table`;
  const data = {};
  data.gameId = event.path.gameId;
  getGameScores(tablename, data.gameId, (err, d) => {
    console.log('err', err);
    if (err) {
      cb({ err: 'error' }, d);
    } else {
      cb(null, { score: d, data });
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

