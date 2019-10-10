import { assert } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import 'pouchdb/dist/pouchdb.js';
import { DataGenerator } from '../arc-data-generator.js';

/* global PouchDB */

describe('DataGenerator', () => {
  describe('setMidninght()', () => {
    it('Returns a number', () => {
      const result = DataGenerator.setMidninght(Date.now());
      assert.typeOf(result, 'number');
    });

    it('Sets milliseconds to 0', () => {
      const result = DataGenerator.setMidninght(Date.now());
      const d = new Date(result);
      assert.equal(d.getMilliseconds(), 0);
    });

    it('Sets seconds to 0', () => {
      const result = DataGenerator.setMidninght(Date.now());
      const d = new Date(result);
      assert.equal(d.getSeconds(), 0);
    });

    it('Sets minutes to 0', () => {
      const result = DataGenerator.setMidninght(Date.now());
      const d = new Date(result);
      assert.equal(d.getMinutes(), 0);
    });

    it('Sets hours to 0', () => {
      const result = DataGenerator.setMidninght(Date.now());
      const d = new Date(result);
      assert.equal(d.getHours(), 0);
    });
  });

  describe('createProjectObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.createProjectObject();
      assert.typeOf(result, 'object');
    });

    it('Has _id', () => {
      const result = DataGenerator.createProjectObject();
      assert.typeOf(result._id, 'string');
    });

    it('Has name', () => {
      const result = DataGenerator.createProjectObject();
      assert.typeOf(result.name, 'string');
    });

    it('Has order', () => {
      const result = DataGenerator.createProjectObject();
      assert.typeOf(result.order, 'number');
    });

    it('Has description', () => {
      const result = DataGenerator.createProjectObject();
      assert.typeOf(result.description, 'string');
    });

    it('Has requests', () => {
      const result = DataGenerator.createProjectObject();
      assert.typeOf(result.requests, 'array');
      assert.lengthOf(result.requests, 0);
    });

    it('Adds passed requestId', () => {
      const result = DataGenerator.createProjectObject({
        requestId: 'test'
      });
      assert.deepEqual(result.requests, ['test']);
    });

    it('Auto generates request id', () => {
      const result = DataGenerator.createProjectObject({
        autoRequestId: true
      });
      assert.typeOf(result.requests[0], 'string');
    });
  });

  describe('generateHeaders()', () => {
    it('Returns headers', () => {
      const result = DataGenerator.generateHeaders('application/json');
      assert.typeOf(result, 'string');
      assert.isAbove(result.length, 2);
    });

    it('Will not generate headers when noHeaders is set', () => {
      const result = DataGenerator.generateHeaders(undefined, {
        noHeaders: true
      });
      assert.equal(result, '');
    });

    it('Adds content-type header', () => {
      const result = DataGenerator.generateHeaders('application/json');
      assert.notEqual(result.indexOf('content-type: application/json'), -1);
    });
  });

  describe('generateMethod()', () => {
    it('Returns a string', () => {
      const result = DataGenerator.generateMethod();
      assert.typeOf(result, 'string');
    });

    it('Uses no-payload pool', () => {
      const result = DataGenerator.generateMethod();
      // This test may not prove that it uses non paylaod mathod but
      // with enough sample it will be statistically significant
      assert.notEqual(DataGenerator.nonPayloadMethods.indexOf(result), -1);
    });

    it('Uses payload pool', () => {
      const result = DataGenerator.generateMethod(true);
      // This test may not prove that it uses non paylaod mathod but
      // with enough sample it will be statistically significant
      assert.notEqual(DataGenerator.payloadMethods.indexOf(result), -1);
    });

    it('Uses passed methodsPools', () => {
      const pool = ['a', 'b'];
      const result = DataGenerator.generateMethod(true, {
        methodsPools: pool
      });
      assert.notEqual(pool.indexOf(result), -1);
    });
  });

  describe('generateIsPayload()', () => {
    it('Returns a boolean', () => {
      const result = DataGenerator.generateIsPayload();
      assert.typeOf(result, 'boolean');
    });

    it('Always returns false for noPayload', () => {
      const result = DataGenerator.generateIsPayload({
        noPayload: true
      });
      assert.isFalse(result);
    });

    it('Always returns true for forcePayload', () => {
      const result = DataGenerator.generateIsPayload({
        forcePayload: true
      });
      assert.isTrue(result);
    });
  });

  describe('generateContentType()', () => {
    it('Returns a string', () => {
      const result = DataGenerator.generateContentType();
      assert.typeOf(result, 'string');
    });

    it('Is one of predefined types', () => {
      const result = DataGenerator.generateContentType();
      assert.notEqual(DataGenerator.contentTypes.indexOf(result), -1);
    });
  });

  describe('generateUrlEncodedData()', () => {
    it('Returns a string', () => {
      const result = DataGenerator.generateUrlEncodedData();
      assert.typeOf(result, 'string');
    });

    it('Has at least one value', () => {
      const result = DataGenerator.generateUrlEncodedData();
      assert.notEqual(result.indexOf('='), -1);
    });
  });

  describe('generateJsonData()', () => {
    it('Returns a string', () => {
      const result = DataGenerator.generateJsonData();
      assert.typeOf(result, 'string');
    });

    it('Is valid JSON', () => {
      const result = DataGenerator.generateJsonData();
      const data = JSON.parse(result);
      assert.typeOf(data, 'object');
    });
  });

  describe('generateXmlData()', () => {
    it('Returns a string', () => {
      const result = DataGenerator.generateXmlData();
      assert.typeOf(result, 'string');
    });
  });

  describe('generatePayload()', () => {
    it('Returns undefined when no content type', () => {
      const result = DataGenerator.generatePayload();
      assert.isUndefined(result);
    });

    it('Calls generateJsonData() for application/json', () => {
      const spy = sinon.spy(DataGenerator, 'generateJsonData');
      DataGenerator.generatePayload('application/json');
      DataGenerator.generateJsonData.restore();
      assert.isTrue(spy.called);
    });

    it('Returns a string for application/json', () => {
      const result = DataGenerator.generatePayload('application/json');
      assert.typeOf(result, 'string');
    });

    it('Calls generateXmlData() for application/xml', () => {
      const spy = sinon.spy(DataGenerator, 'generateXmlData');
      DataGenerator.generatePayload('application/xml');
      DataGenerator.generateXmlData.restore();
      assert.isTrue(spy.called);
    });

    it('Returns a string for application/xml', () => {
      const result = DataGenerator.generatePayload('application/xml');
      assert.typeOf(result, 'string');
    });

    it('Calls generateXmlData() for application/x-www-form-urlencoded', () => {
      const spy = sinon.spy(DataGenerator, 'generateUrlEncodedData');
      DataGenerator.generatePayload('application/x-www-form-urlencoded');
      DataGenerator.generateUrlEncodedData.restore();
      assert.isTrue(spy.called);
    });

    it('Returns a string for application/xml', () => {
      const result = DataGenerator.generatePayload('application/x-www-form-urlencoded');
      assert.typeOf(result, 'string');
    });

    it('Returns a string for text/plain', () => {
      const result = DataGenerator.generatePayload('text/plain');
      assert.typeOf(result, 'string');
    });

    it('Throws for unknown type', () => {
      assert.throws(() => {
        DataGenerator.generatePayload('unknown');
      });
    });
  });

  describe('generateRequestTime()', () => {
    it('Returns a number', () => {
      const result = DataGenerator.generateRequestTime();
      assert.typeOf(result, 'number');
    });

    it('The month is a last month', () => {
      const result = DataGenerator.generateRequestTime();
      const resultDate = new Date(result);
      const date = new Date();
      let month = date.getMonth() - 1;
      if (month === -1) {
        month = 11;
      }
      assert.equal(resultDate.getMonth(), month);
    });

    it('The year is computed', () => {
      const result = DataGenerator.generateRequestTime();
      const resultDate = new Date(result);
      const date = new Date();
      const month = date.getMonth() - 1;
      let year = date.getFullYear();
      if (month === 0) {
        year--;
      }
      assert.equal(resultDate.getFullYear(), year);
    });
  });

  describe('generateDriveId()', () => {
    it('Returns a string', () => {
      const result = DataGenerator.generateDriveId();
      assert.typeOf(result, 'string');
    });

    it('Returns undefined for noGoogleDrive', () => {
      const result = DataGenerator.generateDriveId({
        noGoogleDrive: true
      });
      assert.isUndefined(result);
    });
  });

  describe('generateDescription()', () => {
    it('Returns a string', () => {
      const result = DataGenerator.generateDescription();
      if (result === undefined) {
        // there's 30% chance that generated value is undefined
        return;
      }
      assert.typeOf(result, 'string');
    });

    it('Always returns undefined for noDescription', () => {
      const result = DataGenerator.generateDescription({
        noDescription: true
      });
      assert.isUndefined(result);
    });
  });

  describe('generateSavedItem()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateSavedItem();
      assert.typeOf(result, 'object');
    });

    [
      'generateIsPayload',
      'generateMethod',
      'generateHeaders',
      'generatePayload',
      'generateRequestTime',
      'generateDriveId',
      'generateDescription'
    ].forEach((method) => {
      it(`Calls ${method}()`, () => {
        const spy = sinon.spy(DataGenerator, method);
        DataGenerator.generateSavedItem();
        DataGenerator[method].restore();
        assert.isTrue(spy.called);
      });
    });

    it('Calls generateContentType()', () => {
      const spy = sinon.spy(DataGenerator, 'generateContentType');
      DataGenerator.generateSavedItem({
        forcePayload: true
      });
      DataGenerator.generateContentType.restore();
      assert.isTrue(spy.called);
    });

    [
      ['url', 'string'],
      ['method', 'string'],
      ['headers', 'string'],
      ['created', 'number'],
      ['updated', 'number'],
      ['type', 'string'],
      ['name', 'string'],
      ['driveId', 'string'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateSavedItem();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it(`Has description property of a type string`, () => {
      const result = DataGenerator.generateSavedItem();
      if (result.description === undefined) {
        // there's 30% chance that generated value is undefined
        return;
      }
      assert.typeOf(result.description, 'string');
    });

    it('Has projects proeprty', () => {
      const project = 'a';
      const result = DataGenerator.generateSavedItem({
        project
      });
      assert.deepEqual(result.projects, [project]);
    });

    it('Type proeprty is set', () => {
      const result = DataGenerator.generateSavedItem();
      assert.equal(result.type, 'saved');
    });

    it('Has no driveId when noGoogleDrive is set', () => {
      const result = DataGenerator.generateSavedItem({
        noGoogleDrive: true
      });
      assert.isUndefined(result.driveId);
    });
  });

  describe('generateHistoryObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateHistoryObject();
      assert.typeOf(result, 'object');
    });

    [
      'generateIsPayload',
      'generateMethod',
      'generateHeaders',
      'generatePayload'
    ].forEach((method) => {
      it(`Calls ${method}()`, () => {
        const spy = sinon.spy(DataGenerator, method);
        DataGenerator.generateHistoryObject();
        DataGenerator[method].restore();
        assert.isTrue(spy.called);
      });
    });

    it('Calls generateContentType()', () => {
      const spy = sinon.spy(DataGenerator, 'generateContentType');
      DataGenerator.generateHistoryObject({
        forcePayload: true
      });
      DataGenerator.generateContentType.restore();
      assert.isTrue(spy.called);
    });

    [
      ['url', 'string'],
      ['method', 'string'],
      ['headers', 'string'],
      ['created', 'number'],
      ['updated', 'number'],
      ['type', 'string'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateHistoryObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it('Type proeprty is set', () => {
      const result = DataGenerator.generateHistoryObject();
      assert.equal(result.type, 'history');
    });

    it('Has no _id when noId is used', () => {
      const result = DataGenerator.generateHistoryObject({
        noId: true
      });
      assert.isUndefined(result._id);
    });
  });

  describe('pickProject()', () => {
    const projects = ['a', 'b', 'c'];
    it('Always returns project id', () => {
      const result = DataGenerator.pickProject({
        projects,
        forceProject: true
      });
      assert.notEqual(projects.indexOf(result), -1);
    });

    it('May return project id', () => {
      const result = DataGenerator.pickProject({
        projects
      });
      if (result === undefined) {
        return;
      }
      assert.notEqual(projects.indexOf(result), -1);
    });

    it('Returns undefined when no project', () => {
      const result = DataGenerator.pickProject();
      assert.isUndefined(result);
    });
  });

  describe('generateRequests()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateRequests();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateRequests();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of requests', () => {
      const result = DataGenerator.generateRequests({
        requestsSize: 10
      });
      assert.lengthOf(result, 10);
    });

    it('Calls pickProject()', () => {
      const spy = sinon.spy(DataGenerator, 'pickProject');
      DataGenerator.generateRequests({
        requestsSize: 10
      });
      DataGenerator.pickProject.restore();
      assert.equal(spy.callCount, 10);
    });

    it('Calls generateSavedItem()', () => {
      const spy = sinon.spy(DataGenerator, 'generateSavedItem');
      DataGenerator.generateRequests({
        requestsSize: 10
      });
      DataGenerator.generateSavedItem.restore();
      assert.equal(spy.callCount, 10);
    });

    it('Adds project to the request', () => {
      const projects = [{ _id: 1 }];
      const result = DataGenerator.generateRequests({
        requestsSize: 2,
        forceProject: true,
        projects
      });

      assert.deepEqual(result[0].projects, [1]);
    });

    it('Adds request to the project', () => {
      const projects = [{ _id: 1 }];
      DataGenerator.generateRequests({
        requestsSize: 2,
        forceProject: true,
        projects
      });

      assert.typeOf(projects[0].requests[0], 'string');
    });
  });

  describe('generateProjects()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateProjects();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateProjects();
      assert.lengthOf(result, 5);
    });

    it('Returns requested number of requests', () => {
      const result = DataGenerator.generateProjects({
        projectsSize: 10
      });
      assert.lengthOf(result, 10);
    });

    it('Calls createProjectObject()', () => {
      const spy = sinon.spy(DataGenerator, 'createProjectObject');
      DataGenerator.generateProjects({
        projectsSize: 10
      });
      DataGenerator.createProjectObject.restore();
      assert.equal(spy.callCount, 10);
    });
  });

  describe('generateSavedRequestData()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateSavedRequestData();
      assert.typeOf(result, 'object');
    });

    it('Calls generateProjects()', () => {
      const spy = sinon.spy(DataGenerator, 'generateProjects');
      DataGenerator.generateSavedRequestData();
      DataGenerator.generateProjects.restore();
      assert.isTrue(spy.called);
    });

    it('Calls generateRequests()', () => {
      const spy = sinon.spy(DataGenerator, 'generateRequests');
      DataGenerator.generateSavedRequestData();
      DataGenerator.generateRequests.restore();
      assert.isTrue(spy.called);
    });

    it('Passes options to generateProjects()', () => {
      const result = DataGenerator.generateSavedRequestData({
        projectsSize: 1
      });
      assert.lengthOf(result.projects, 1);
    });

    it('Passes options to generateRequests()', () => {
      const result = DataGenerator.generateSavedRequestData({
        requestsSize: 1
      });
      assert.lengthOf(result.requests, 1);
    });
  });

  describe('generateHistoryRequestsData()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateHistoryRequestsData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateHistoryRequestsData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of requests', () => {
      const result = DataGenerator.generateHistoryRequestsData({
        requestsSize: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls createProjectObject()', () => {
      const spy = sinon.spy(DataGenerator, 'generateHistoryObject');
      DataGenerator.generateHistoryRequestsData({
        requestsSize: 5
      });
      DataGenerator.generateHistoryObject.restore();
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateVariableObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateVariableObject();
      assert.typeOf(result, 'object');
    });

    [
      ['enabled', 'boolean'],
      ['value', 'string'],
      ['variable', 'string'],
      ['_id', 'string'],
      ['environment', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateVariableObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it('Always creates "default" environment', () => {
      const result = DataGenerator.generateVariableObject({
        defaultEnv: true
      });
      assert.equal(result.environment, 'default');
    });

    it('Always creates random environment', () => {
      const result = DataGenerator.generateVariableObject({
        randomEnv: true
      });
      assert.notEqual(result.environment, 'default');
    });
  });

  describe('generateVariablesData()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateVariablesData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateVariablesData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of variables', () => {
      const result = DataGenerator.generateVariablesData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateVariableObject()', () => {
      const spy = sinon.spy(DataGenerator, 'generateVariableObject');
      DataGenerator.generateVariablesData({
        size: 5
      });
      DataGenerator.generateVariableObject.restore();
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateHeaderSetObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateHeaderSetObject();
      assert.typeOf(result, 'object');
    });

    [
      ['created', 'number'],
      ['updated', 'number'],
      ['order', 'number'],
      ['name', 'string'],
      ['headers', 'string'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateHeaderSetObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('generateHeadersSetsData()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateHeadersSetsData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateHeadersSetsData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = DataGenerator.generateHeadersSetsData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateHeaderSetObject()', () => {
      const spy = sinon.spy(DataGenerator, 'generateHeaderSetObject');
      DataGenerator.generateHeadersSetsData({
        size: 5
      });
      DataGenerator.generateHeaderSetObject.restore();
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateCookieObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateCookieObject();
      assert.typeOf(result, 'object');
    });

    [
      ['created', 'number'],
      ['updated', 'number'],
      ['expires', 'number'],
      ['maxAge', 'number'],
      ['name', 'string'],
      ['_id', 'string'],
      ['value', 'string'],
      ['domain', 'string'],
      ['hostOnly', 'boolean'],
      ['httpOnly', 'boolean'],
      ['lastAccess', 'number'],
      ['path', 'string'],
      ['persistent', 'boolean']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateCookieObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('generateCookiesData()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateCookiesData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateCookiesData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = DataGenerator.generateCookiesData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateHeaderSetObject()', () => {
      const spy = sinon.spy(DataGenerator, 'generateCookieObject');
      DataGenerator.generateCookiesData({
        size: 5
      });
      DataGenerator.generateCookieObject.restore();
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateUrlObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateUrlObject();
      assert.typeOf(result, 'object');
    });

    [
      ['time', 'number'],
      ['cnt', 'number'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateUrlObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('generateUrlsData()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateUrlsData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateUrlsData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = DataGenerator.generateUrlsData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateUrlObject()', () => {
      const spy = sinon.spy(DataGenerator, 'generateUrlObject');
      DataGenerator.generateUrlsData({
        size: 5
      });
      DataGenerator.generateUrlObject.restore();
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateHostRuleObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateHostRuleObject();
      assert.typeOf(result, 'object');
    });

    [
      ['_id', 'string'],
      ['from', 'String'],
      ['to', 'string'],
      ['enabled', 'boolean'],
      ['comment', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateHostRuleObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('generateHostRulesData()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateHostRulesData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateHostRulesData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = DataGenerator.generateHostRulesData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateHostRuleObject()', () => {
      const spy = sinon.spy(DataGenerator, 'generateHostRuleObject');
      DataGenerator.generateHostRulesData({
        size: 5
      });
      DataGenerator.generateHostRuleObject.restore();
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateBasicAuthObject()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateBasicAuthObject();
      assert.typeOf(result, 'object');
    });

    [
      ['_id', 'string'],
      ['type', 'String'],
      ['url', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = DataGenerator.generateBasicAuthObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it('Type is "basic"', () => {
      const result = DataGenerator.generateBasicAuthObject();
      assert.equal(result.type, 'basic');
    });

    it('_id starts with "basic?"', () => {
      const result = DataGenerator.generateBasicAuthObject();
      assert.equal(result._id.indexOf('basic/'), 0);
    });
  });

  describe('generateBasicAuthData()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateBasicAuthData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = DataGenerator.generateBasicAuthData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = DataGenerator.generateBasicAuthData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateHostRuleObject()', () => {
      const spy = sinon.spy(DataGenerator, 'generateBasicAuthObject');
      DataGenerator.generateBasicAuthData({
        size: 5
      });
      DataGenerator.generateBasicAuthObject.restore();
      assert.equal(spy.callCount, 5);
    });
  });


  describe('generateApiIndex()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateApiIndex();
      assert.typeOf(result, 'object');
    });

    [
      ['_id', 'string'],
      ['order', 'number'],
      ['title', 'string'],
      ['type', 'string'],
      ['latest', 'string'],
      ['versions', 'array']
    ].forEach(([property, type]) => {
      it(`Has ${property} property of a type ${type}`, () => {
        const result = DataGenerator.generateApiIndex();
        assert.typeOf(result[property], type);
      });
    });

    it('generate versionsSize versions', () => {
      const result = DataGenerator.generateApiIndex({
        versionSize: 10
      });
      assert.lengthOf(result.versions, 10);
    });
  });

  describe('generateApiIndexList()', () => {
    it('returns an array', () => {
      const result = DataGenerator.generateApiIndexList();
      assert.typeOf(result, 'array');
    });

    it('has size items', () => {
      const result = DataGenerator.generateApiIndexList({
        size: 10
      });
      assert.lengthOf(result, 10);
    });

    it('calls generateApiIndex() for each item', () => {
      const spy = sinon.spy(DataGenerator, 'generateApiIndex');
      DataGenerator.generateApiIndexList({
        size: 2
      });
      DataGenerator.generateApiIndex.restore();
      assert.equal(spy.callCount, 2);
    });
  });

  describe('generateApiData()', () => {
    it('Returns an array', () => {
      const index = DataGenerator.generateApiIndex();
      const result = DataGenerator.generateApiData(index);
      assert.typeOf(result, 'array');
    });

    [
      ['_id', 'string'],
      ['data', 'string'],
      ['version', 'string'],
      ['indexId', 'string']
    ].forEach(([property, type]) => {
      it(`Has ${property} property of a type ${type}`, () => {
        const index = DataGenerator.generateApiIndex();
        const result = DataGenerator.generateApiData(index)[0];
        assert.typeOf(result[property], type);
      });
    });

    it('generate an item for each version', () => {
      const index = DataGenerator.generateApiIndex({
        versionSize: 6
      });
      const result = DataGenerator.generateApiData(index);
      assert.lengthOf(result, 6);
    });
  });

  describe('generateClientCertificate()', () => {
    it('Returns an object', () => {
      const result = DataGenerator.generateClientCertificate();
      assert.typeOf(result, 'object');
    });

    [
      ['type', 'String'],
      ['cert', 'object'],
      ['key', 'object'],
      ['name', 'string'],
      ['created', 'number'],
    ].forEach(([prop, type]) => {
      it(`Has ${prop} property of a type ${type}`, () => {
        const result = DataGenerator.generateClientCertificate();
        assert.typeOf(result[prop], type);
      });
    });

    it('uses passed type', () => {
      const result = DataGenerator.generateClientCertificate({
        type: 'p12'
      });
      assert.equal(result.type, 'p12');
    });

    it('ignores created', () => {
      const result = DataGenerator.generateClientCertificate({
        noCreated: true
      });
      assert.isUndefined(result.created);
    });

    it('creates binary data on a certificate', () => {
      const result = DataGenerator.generateClientCertificate({
        binary: true
      });
      assert.typeOf(result.cert.data, 'Uint8Array');
    });

    it('adds passphrase to a certificate by default', () => {
      const result = DataGenerator.generateClientCertificate({});
      assert.typeOf(result.cert.passphrase, 'string');
    });

    it('ignores passphrase on a certificate', () => {
      const result = DataGenerator.generateClientCertificate({
        noPassphrase: true
      });
      assert.isUndefined(result.cert.passphrase);
    });
  });

  describe('generateClientCertificates()', () => {
    it('Returns an array', () => {
      const result = DataGenerator.generateClientCertificates();
      assert.typeOf(result, 'array');
    });

    it('List has default number of items', () => {
      const result = DataGenerator.generateClientCertificates();
      assert.lengthOf(result, 15);
    });

    it('Returns requested number of items', () => {
      const result = DataGenerator.generateClientCertificates({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateClientCertificate()', () => {
      const spy = sinon.spy(DataGenerator, 'generateClientCertificate');
      DataGenerator.generateClientCertificates({
        size: 5
      });
      DataGenerator.generateClientCertificate.restore();
      assert.equal(spy.callCount, 5);
    });
  });

  describe('insertSavedIfNotExists()', () => {
    beforeEach(async () => {
      await DataGenerator.destroySavedRequestData();
    });

    it('Inserts new saved request data', async () => {
      await DataGenerator.insertSavedIfNotExists();
      const savedDb = new PouchDB('saved-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 25);
    });

    it('Inserts new projects data', async () => {
      await DataGenerator.insertSavedIfNotExists();
      const savedDb = new PouchDB('legacy-projects');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 5);
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertSavedIfNotExists();
      assert.lengthOf(result.requests, 25, 'Has requests array');
      assert.lengthOf(result.projects, 5, 'Has projects array');

      assert.typeOf(result.requests[0]._id, 'string', 'Request has _id');
      assert.typeOf(result.requests[0]._rev, 'string', 'Request has _rev');

      assert.typeOf(result.projects[0]._id, 'string', 'Project has _id');
      assert.typeOf(result.projects[0]._rev, 'string', 'Project has _rev');
    });

    it('Ignores insert of requests when exists', async () => {
      const insert = await DataGenerator.insertSavedRequestData({
        // More than 1 can cause order problems
        // Retreived from the data store documents may be in different order
        // so it's safer to test single request to reduce tests logic
        requestsSize: 1
      });

      const result = await DataGenerator.insertSavedIfNotExists();
      assert.deepEqual(result.requests, insert.requests);
    });

    it('Ignores insert of projects when exists', async () => {
      const insert = await DataGenerator.insertSavedRequestData({
        requestsSize: 1,
        projectsSize: 1
      });
      const result = await DataGenerator.insertSavedIfNotExists();
      assert.deepEqual(result.projects, insert.projects);
    });
  });

  describe('insertHistoryIfNotExists()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyHistoryData();
    });

    it('Inserts new history request data', async () => {
      await DataGenerator.insertHistoryIfNotExists();
      const savedDb = new PouchDB('history-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 25);
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertHistoryIfNotExists();
      assert.lengthOf(result, 25, 'Has requests list');

      assert.typeOf(result[0]._id, 'string', 'Request has _id');
      assert.typeOf(result[0]._rev, 'string', 'Request has _rev');
    });

    it('Ignores insert of requests when exists', async () => {
      const insert = await DataGenerator.insertHistoryRequestData({
        // More than 1 can cause order problems
        // Retreived from the data store documents may be in different order
        // so it's safer to test single request to reduce tests logic
        requestsSize: 1
      });

      const result = await DataGenerator.insertHistoryIfNotExists();
      assert.deepEqual(result, insert);
    });
  });

  describe('insertSavedRequestData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroySavedRequestData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertSavedRequestData();

      assert.lengthOf(result.requests, 25, 'Has requests array');
      assert.lengthOf(result.projects, 5, 'Has projects array');
    });

    it('Project has updated _rev', async () => {
      const result = await DataGenerator.insertSavedRequestData({
        projectsSize: 1,
        requestsSize: 1
      });

      assert.typeOf(result.projects[0]._id, 'string', 'Project has _id');
      assert.typeOf(result.projects[0]._rev, 'string', 'Project has _rev');
    });

    it('Request has updated _rev', async () => {
      const result = await DataGenerator.insertSavedRequestData({
        projectsSize: 1,
        requestsSize: 1
      });

      assert.typeOf(result.requests[0]._id, 'string', 'Request has _id');
      assert.typeOf(result.requests[0]._rev, 'string', 'Request has _rev');
    });

    it('Calls generateSavedRequestData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateSavedRequestData');
      await DataGenerator.insertSavedRequestData({
        projectsSize: 1,
        requestsSize: 1
      });
      DataGenerator.generateSavedRequestData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertHistoryRequestData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyHistoryData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertHistoryRequestData();
      assert.lengthOf(result, 25);
    });

    it('Request has updated _rev', async () => {
      const result = await DataGenerator.insertHistoryRequestData({
        requestsSize: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Request has _id');
      assert.typeOf(result[0]._rev, 'string', 'Request has _rev');
    });

    it('Calls generateHistoryRequestsData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateHistoryRequestsData');
      await DataGenerator.insertHistoryRequestData({
        requestsSize: 1
      });
      DataGenerator.generateHistoryRequestsData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertProjectsData()', () => {
    beforeEach(async () => {
      await DataGenerator.clearLegacyProjects();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertProjectsData();
      assert.lengthOf(result, 5);
    });

    it('Object has updated _rev', async () => {
      const result = await DataGenerator.insertProjectsData({
        projectsSize: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateProjects()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateProjects');
      await DataGenerator.insertProjectsData({
        projectsSize: 1
      });
      DataGenerator.generateProjects.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertWebsocketData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyWebsocketsData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertWebsocketData();
      assert.lengthOf(result, 25);
    });

    it('Request has updated _rev', async () => {
      const result = await DataGenerator.insertWebsocketData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Object generateUrlsData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateUrlsData');
      await DataGenerator.insertWebsocketData({
        size: 1
      });
      DataGenerator.generateUrlsData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertUrlHistoryData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyUrlData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertUrlHistoryData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await DataGenerator.insertUrlHistoryData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateUrlsData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateUrlsData');
      await DataGenerator.insertUrlHistoryData({
        size: 1
      });
      DataGenerator.generateUrlsData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertVariablesData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyVariablesData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertVariablesData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await DataGenerator.insertVariablesData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateVariablesData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateVariablesData');
      await DataGenerator.insertVariablesData({
        size: 1
      });
      DataGenerator.generateVariablesData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertHeadersSetsData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyHeadersData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertHeadersSetsData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await DataGenerator.insertHeadersSetsData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateHeadersSetsData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateHeadersSetsData');
      await DataGenerator.insertHeadersSetsData({
        size: 1
      });
      DataGenerator.generateHeadersSetsData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertCookiesData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyCookiesData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertCookiesData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await DataGenerator.insertCookiesData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateCookiesData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateCookiesData');
      await DataGenerator.insertCookiesData({
        size: 1
      });
      DataGenerator.generateCookiesData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertBasicAuthData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyAuthData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertBasicAuthData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await DataGenerator.insertBasicAuthData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateBasicAuthData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateBasicAuthData');
      await DataGenerator.insertBasicAuthData({
        size: 1
      });
      DataGenerator.generateBasicAuthData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertHostRulesData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyHostRulesData();
    });

    it('Returns generated data', async () => {
      const result = await DataGenerator.insertHostRulesData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await DataGenerator.insertHostRulesData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateHostRulesData()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateHostRulesData');
      await DataGenerator.insertHostRulesData({
        size: 1
      });
      DataGenerator.generateHostRulesData.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertApiData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyAllApiData();
    });

    it('returns generated data', async () => {
      const result = await DataGenerator.insertApiData();
      assert.lengthOf(result[0], 25);
      assert.isAbove(result[1].length, 25);
    });

    it('object has updated _rev', async () => {
      const result = await DataGenerator.insertApiData({
        size: 1
      });
      assert.typeOf(result[0][0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0][0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateApiIndexList()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateApiIndexList');
      await DataGenerator.insertApiData({
        size: 1
      });
      DataGenerator.generateApiIndexList.restore();
      assert.isTrue(spy.called);
    });

    it('Calls generateApiDataList()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateApiDataList');
      await DataGenerator.insertApiData({
        size: 1
      });
      DataGenerator.generateApiDataList.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('insertCertificatesData()', () => {
    beforeEach(async () => {
      await DataGenerator.destroyClientCertificates();
    });

    it('returns generated data', async () => {
      const result = await DataGenerator.insertCertificatesData();
      assert.lengthOf(result, 15);
    });

    it('object has updated _rev', async () => {
      const result = await DataGenerator.insertCertificatesData({
        size: 1
      });
      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateClientCertificates()', async () => {
      const spy = sinon.spy(DataGenerator, 'generateClientCertificates');
      await DataGenerator.insertCertificatesData({
        size: 1
      });
      DataGenerator.generateClientCertificates.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('destroySavedRequestData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertSavedRequestData();
    });

    it('Clears saved-requests store', async () => {
      await DataGenerator.destroySavedRequestData();
      const savedDb = new PouchDB('saved-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });

    it('Clears legacy-requests store', async () => {
      await DataGenerator.destroySavedRequestData();
      const db = new PouchDB('legacy-requests');
      const response = await db.allDocs();
      assert.equal(response.total_rows, 0);
    });
  });

  describe('destroyHistoryData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertHistoryRequestData();
    });

    it('Clears history-requests store', async () => {
      await DataGenerator.destroyHistoryData();
      const savedDb = new PouchDB('history-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('clearLegacyProjects()', () => {
    beforeEach(async () => {
      await DataGenerator.insertProjectsData();
    });

    it('Clears legacy-projects store', async () => {
      await DataGenerator.clearLegacyProjects();
      const savedDb = new PouchDB('legacy-projects');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyWebsocketsData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertWebsocketData();
    });

    it('Clears websocket-url-history store', async () => {
      await DataGenerator.destroyWebsocketsData();
      const savedDb = new PouchDB('websocket-url-history');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyUrlData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertUrlHistoryData();
    });

    it('Clears url-history store', async () => {
      await DataGenerator.destroyUrlData();
      const savedDb = new PouchDB('url-history');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyHeadersData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertHeadersSetsData();
    });

    it('Clears headers-sets store', async () => {
      await DataGenerator.destroyHeadersData();
      const savedDb = new PouchDB('headers-sets');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyVariablesData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertVariablesData();
    });

    it('Clears variables store', async () => {
      await DataGenerator.destroyVariablesData();
      const savedDb = new PouchDB('variables');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });

    it('Clears variables-environments store', async () => {
      await DataGenerator.destroyVariablesData();
      const savedDb = new PouchDB('variables-environments');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyCookiesData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertCookiesData();
    });

    it('Clears cookies store', async () => {
      await DataGenerator.destroyCookiesData();
      const savedDb = new PouchDB('cookies');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyAuthData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertBasicAuthData();
    });

    it('Clears auth-data store', async () => {
      await DataGenerator.destroyAuthData();
      const savedDb = new PouchDB('auth-data');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyHostRulesData()', () => {
    beforeEach(async () => {
      await DataGenerator.insertHostRulesData();
    });

    it('Clears host-rules store', async () => {
      await DataGenerator.destroyHostRulesData();
      const savedDb = new PouchDB('host-rules');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyApiIndexData()', () => {
    beforeEach(async () => {
      const db = new PouchDB('api-index');
      await db.put({ _id: 'test-' + Date.now() });
    });

    it('Clears api-index store', async () => {
      await DataGenerator.destroyApiIndexData();
      const savedDb = new PouchDB('api-index');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyApiData()', () => {
    beforeEach(async () => {
      const db = new PouchDB('api-data');
      await db.put({ _id: 'test-' + Date.now() });
    });

    it('Clears api-index store', async () => {
      await DataGenerator.destroyApiData();
      const savedDb = new PouchDB('api-data');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyClientCertificates()', () => {
    beforeEach(async () => {
      const db = new PouchDB('client-certificates');
      await db.put({ _id: 'test-' + Date.now() });
    });

    it('Clears client-certificates store', async () => {
      await DataGenerator.destroyClientCertificates();
      const savedDb = new PouchDB('client-certificates');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyAll()', () => {
    const spies = [];
    const fns = [
      'destroySavedRequestData',
      'destroyHistoryData',
      'destroyWebsocketsData',
      'destroyUrlData',
      'destroyHeadersData',
      'destroyVariablesData',
      'destroyCookiesData',
      'destroyAuthData',
      'destroyHostRulesData',
      'destroyApiIndexData',
      'destroyApiData'
    ];

    before(async function() {
      fns.forEach((fn) => {
        const spy = sinon.spy(DataGenerator, fn);
        spies.push(spy);
      });
      await DataGenerator.destroyAll();
      fns.forEach((fn) => {
        DataGenerator[fn].restore();
      });
    });

    fns.forEach((fn, index) => {
      it(`Calls ${fn}()`, async () => {
        assert.isTrue(spies[index].called);
      });
    });
  });

  describe('clone()', () => {
    it('Creates a copy', () => {
      const src = {
        a: 'true'
      };
      const result = DataGenerator.clone(src);
      assert.deepEqual(result, src);
      assert.isFalse(result === src);
    });

    it('Handles Date Object', () => {
      const d = new Date();
      const src = {
        a: d
      };
      const result = DataGenerator.clone(src);
      assert.equal(result.a.getTime(), src.a.getTime());
      assert.isFalse(result.a === d);
    });

    it('Handles Array', () => {
      const src = ['a', 'b', { inner: true }, ['inner']];
      const result = DataGenerator.clone(src);
      assert.deepEqual(result, src);
      assert.isFalse(result === src);
    });
  });

  describe('Data getters', () => {
    before(function() {
      return DataGenerator.destroyAll();
    });

    after(function() {
      return DataGenerator.destroyAll();
    });

    [
      ['getDatastoreRequestData', 'insertSavedRequestData', 25],
      ['getDatastoreProjectsData', 'insertProjectsData', 10],
      ['getDatastoreHistoryData', 'insertHistoryRequestData', 25],
      ['getDatastoreVariablesData', 'insertVariablesData', 25],
      ['getDatastoreHeadersData', 'insertHeadersSetsData', 25],
      ['getDatastoreWebsocketsData', 'insertWebsocketData', 25],
      ['getDatastoreUrlsData', 'insertUrlHistoryData', 25],
      ['getDatastoreAuthData', 'insertBasicAuthData', 25],
      ['getDatastoreHostRulesData', 'insertHostRulesData', 25],
      ['getDatastoreCookiesData', 'insertCookiesData', 25]
    ].forEach((item) => {
      it(`${item[0]}() returns the data`, async () => {
        await DataGenerator[item[1]]();
        const data = await DataGenerator[item[0]]();
        assert.typeOf(data, 'array');
        assert.lengthOf(data, item[2]);
      });
    });
  });
});
