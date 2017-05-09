'use strict';

var shortid = require('shortid');

const AWS = require('aws-sdk');  
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.setscore = (event, context, cb) => {
    var stage = event.stage || "dev";
    var tablename = stage+"-game-table";
    var data = {};
    data.gameId = event.path.gameId;
    data.hole = parseInt(event.path.hole);
    data.score = parseInt(event.path.score);
    data.user = event.path.user;
    data.userandhole = data.user+":"+data.hole;
    console.log('data out',data);
    var params = {
        TableName: tablename, 
        Item: data
    };

    dynamo.put(params, function(err,d){ 
        console.log('data', d); 
        console.log('err', err);
        if (!!err) {
            cb(err,d);
        } else {
            getGameScores(tablename, data.gameId, function(err,d) {
                console.log('err', err);
                if (!!err) {
                    cb({err: "error"}, data );
                } else {
                    cb(null, { score: d, data: data });
                }        
            });            
        }
    });
};

module.exports.getgamescore = (event, context, cb) =>{
    var stage = event.stage || "dev";
    var tablename = stage+"-game-table";
    var data = {};
    data.gameId = event.path.gameId;
    var params = {
        TableName: tablename, 
        Item: data
    };
    getGameScores(tablename, data.gameId, function(err,d) {
        console.log('err', err);
        if (!!err) {
            cb({err: "error"}, data );
        } else {
            cb(null, { score: d, data: data });
        }        
    }); 
};

module.exports.creategame = (event, context, cb) => {    
    var gameId = shortid.generate();
    console.log('get', event.stage + "-game-table");
    console.log(event.stage);
    var stage = event.stage || "dev";
    var tablename = stage+"-game-table";
    console.log(tablename);
    var item = {
        gameId: gameId,
        userandhole: event.path.user+":1"
    };

    addNewGame(tablename, item, cb);    
};

function addNewGame(tablename, item, cb ) {
    gameExists(tablename, item.gameId, function(err, exists) {
        console.log('add a new one', exists);
        console.log('err',err);
        if (exists) {
            console.log('id exists, new id');
            item.gameId = shortid.generate();
        }
        console.log("put"); 
        var params = {
            TableName: tablename, 
            Item: item
        };
        dynamo.put(params, function(err,data){ 
            console.log('data', data); 
            console.log('err', err);
            if (!!err) {
                cb({err: "error"}, data);
            } else {
                cb(null, { gameId: item.gameId });
            }
        });        
    });    
}

function gameExists(tablename, gameId, cb) {
    var params = {
        TableName : tablename,
        KeyConditionExpression: "#id = :gameId",
        ExpressionAttributeNames:{
            "#id": "gameId"
        },
        ExpressionAttributeValues: {
            ":gameId": gameId
        },
        Limit: 1
    };

    dynamo.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            cb(err, false);
        } else {
            console.log("Query succeeded.");
            console.log(data.Items);
            cb(null, data.Items.length > 0);
        }
    });
}


function getGameScores(tablename, gameId, cb) {
    var params = {
        TableName : tablename,
        ProjectionExpression:"#id, #user, hole, score",
        KeyConditionExpression: "#id = :gameId",
        ExpressionAttributeNames:{
            "#id": "gameId",
            "#user": "user"
        },
        ExpressionAttributeValues: {
            ":gameId": gameId
        }
    };
    
    dynamo.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            cb(err, null);
        } else {
            console.log(data);
            console.log(data.Items);
            console.log("Query succeeded.");
            cb(null, data.Items);
        }
    });
}

