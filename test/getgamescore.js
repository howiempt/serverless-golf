'use strict';

const mod = require('../handler.js');
const mochaPlugin = require('serverless-mocha-plugin');

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'getgamescore' });

describe('getgamescore', () => {
  before((done) => {
//  lambdaWrapper.init(liveFunction); // Run the deployed lambda

    done();
  });

  it('implement tests here', () => {
    return wrapped.run({}).then((response) => {
      expect(response).to.not.be.empty;
    });
  });
});
