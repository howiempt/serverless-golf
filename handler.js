'use strict';

// Your first function handler
module.exports.setscore = (event, context, cb) => cb(null,
  { message: 'set score', event }
);

module.exports.getgamescore = (event, context, cb) => cb(null,
  { message: 'get game score', event }
);

module.exports.creategame = (event, context, cb) => cb(null,
  { message: 'create game', event }
);