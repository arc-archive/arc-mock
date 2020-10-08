import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import 'pouchdb/dist/pouchdb.js';
import { DataGenerator } from '../index.js';

/* global PouchDB */

describe('DataGenerator', () => {
  describe('setMidnight()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a number', () => {
      const result = gen.setMidnight(Date.now());
      assert.typeOf(result, 'number');
    });

    it('Sets milliseconds to 0', () => {
      const result = gen.setMidnight(Date.now());
      const d = new Date(result);
      assert.equal(d.getMilliseconds(), 0);
    });

    it('Sets seconds to 0', () => {
      const result = gen.setMidnight(Date.now());
      const d = new Date(result);
      assert.equal(d.getSeconds(), 0);
    });

    it('Sets minutes to 0', () => {
      const result = gen.setMidnight(Date.now());
      const d = new Date(result);
      assert.equal(d.getMinutes(), 0);
    });

    it('Sets hours to 0', () => {
      const result = gen.setMidnight(Date.now());
      const d = new Date(result);
      assert.equal(d.getHours(), 0);
    });
  });

  describe('createProjectObject()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.createProjectObject();
      assert.typeOf(result, 'object');
    });

    it('Has _id', () => {
      const result = gen.createProjectObject();
      assert.typeOf(result._id, 'string');
    });

    it('Has name', () => {
      const result = gen.createProjectObject();
      assert.typeOf(result.name, 'string');
    });

    it('Has order', () => {
      const result = gen.createProjectObject();
      assert.typeOf(result.order, 'number');
    });

    it('Has description', () => {
      const result = gen.createProjectObject();
      assert.typeOf(result.description, 'string');
    });

    it('Has requests', () => {
      const result = gen.createProjectObject();
      assert.typeOf(result.requests, 'array');
      assert.lengthOf(result.requests, 0);
    });

    it('Adds passed requestId', () => {
      const result = gen.createProjectObject({
        requestId: 'test'
      });
      assert.deepEqual(result.requests, ['test']);
    });

    it('Auto generates request id', () => {
      const result = gen.createProjectObject({
        autoRequestId: true
      });
      assert.typeOf(result.requests[0], 'string');
    });
  });

  describe('generateHeaders()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns headers', () => {
      const result = gen.generateHeaders('application/json');
      assert.typeOf(result, 'string');
      assert.isAbove(result.length, 2);
    });

    it('Will not generate headers when noHeaders is set', () => {
      const result = gen.generateHeaders(undefined, {
        noHeaders: true
      });
      assert.equal(result, '');
    });

    it('Adds content-type header', () => {
      const result = gen.generateHeaders('application/json');
      assert.notEqual(result.indexOf('content-type: application/json'), -1);
    });
  });

  describe('generateMethod()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a string', () => {
      const result = gen.generateMethod();
      assert.typeOf(result, 'string');
    });

    it('Uses no-payload pool', () => {
      const result = gen.generateMethod();
      // This test may not prove that it uses non payload method but
      // with enough sample it will be statistically significant
      assert.notEqual(gen.nonPayloadMethods.indexOf(result), -1);
    });

    it('Uses payload pool', () => {
      const result = gen.generateMethod(true);
      // This test may not prove that it uses non payload method but
      // with enough sample it will be statistically significant
      assert.notEqual(gen.payloadMethods.indexOf(result), -1);
    });

    it('Uses passed methodsPools', () => {
      const pool = ['a', 'b'];
      const result = gen.generateMethod(true, {
        methodsPools: pool
      });
      assert.notEqual(pool.indexOf(result), -1);
    });
  });

  describe('generateIsPayload()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a boolean', () => {
      const result = gen.generateIsPayload();
      assert.typeOf(result, 'boolean');
    });

    it('Always returns false for noPayload', () => {
      const result = gen.generateIsPayload({
        noPayload: true
      });
      assert.isFalse(result);
    });

    it('Always returns true for forcePayload', () => {
      const result = gen.generateIsPayload({
        forcePayload: true
      });
      assert.isTrue(result);
    });
  });

  describe('generateContentType()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('returns a string', () => {
      const result = gen.generateContentType();
      assert.typeOf(result, 'string');
    });
  });

  describe('generateUrlEncodedData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a string', () => {
      const result = gen.generateUrlEncodedData();
      assert.typeOf(result, 'string');
    });

    it('Has at least one value', () => {
      const result = gen.generateUrlEncodedData();
      assert.notEqual(result.indexOf('='), -1);
    });
  });

  describe('generateJsonData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a string', () => {
      const result = gen.generateJsonData();
      assert.typeOf(result, 'string');
    });

    it('Is valid JSON', () => {
      const result = gen.generateJsonData();
      const data = JSON.parse(result);
      assert.typeOf(data, 'object');
    });
  });

  describe('generateXmlData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a string', () => {
      const result = gen.generateXmlData();
      assert.typeOf(result, 'string');
    });
  });

  describe('generatePayload()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns undefined when no content type', () => {
      const result = gen.generatePayload();
      assert.isUndefined(result);
    });

    it('Calls generateJsonData() for application/json', () => {
      const spy = sinon.spy(gen, 'generateJsonData');
      gen.generatePayload('application/json');
      assert.isTrue(spy.called);
    });

    it('Returns a string for application/json', () => {
      const result = gen.generatePayload('application/json');
      assert.typeOf(result, 'string');
    });

    it('Calls generateXmlData() for application/xml', () => {
      const spy = sinon.spy(gen, 'generateXmlData');
      gen.generatePayload('application/xml');
      assert.isTrue(spy.called);
    });

    it('Returns a string for application/xml', () => {
      const result = gen.generatePayload('application/xml');
      assert.typeOf(result, 'string');
    });

    it('Calls generateXmlData() for application/x-www-form-urlencoded', () => {
      const spy = sinon.spy(gen, 'generateUrlEncodedData');
      gen.generatePayload('application/x-www-form-urlencoded');
      assert.isTrue(spy.called);
    });

    it('Returns a string for application/xml', () => {
      const result = gen.generatePayload('application/x-www-form-urlencoded');
      assert.typeOf(result, 'string');
    });

    it('Returns a string for text/plain', () => {
      const result = gen.generatePayload('text/plain');
      assert.typeOf(result, 'string');
    });

    it('returns empty string for an unknown type', () => {
      const result = gen.generatePayload('unknown');
      assert.equal(result, '');
    });
  });

  describe('generateRequestTime()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a number', () => {
      const result = gen.generateRequestTime();
      assert.typeOf(result, 'number');
    });

    it('The month is a last month', () => {
      const result = gen.generateRequestTime();
      const resultDate = new Date(result);
      const date = new Date();
      let month = date.getMonth() - 1;
      if (month === -1) {
        month = 11;
      }
      assert.equal(resultDate.getMonth(), month);
    });

    it('The year is computed', () => {
      const result = gen.generateRequestTime();
      const resultDate = new Date(result);
      const date = new Date();
      const month = date.getMonth() - 1;
      let year = date.getFullYear();
      if (month === 0) {
        year -= 1;
      }
      assert.equal(resultDate.getFullYear(), year);
    });
  });

  describe('generateDriveId()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a string', () => {
      const result = gen.generateDriveId();
      assert.typeOf(result, 'string');
    });

    it('Returns undefined for noGoogleDrive', () => {
      const result = gen.generateDriveId({
        noGoogleDrive: true,
      });
      assert.isUndefined(result);
    });
  });

  describe('generateDescription()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns a string', () => {
      const result = gen.generateDescription();
      if (result === undefined) {
        // there's 30% chance that generated value is undefined
        return;
      }
      assert.typeOf(result, 'string');
    });

    it('Always returns undefined for noDescription', () => {
      const result = gen.generateDescription({
        noDescription: true
      });
      assert.isUndefined(result);
    });
  });

  describe('generateSavedItem()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateSavedItem();
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
        // @ts-ignore
        const spy = sinon.spy(gen, method);
        gen.generateSavedItem();
        assert.isTrue(spy.called);
      });
    });

    it('Calls generateContentType()', () => {
      const spy = sinon.spy(gen, 'generateContentType');
      gen.generateSavedItem({
        forcePayload: true
      });
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
      ['midnight', 'number'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = gen.generateSavedItem();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it(`Has description property of a type string`, () => {
      const result = gen.generateSavedItem();
      if (result.description === undefined) {
        // there's 30% chance that generated value is undefined
        return;
      }
      assert.typeOf(result.description, 'string');
    });

    it('Has projects property', () => {
      const project = 'a';
      const result = gen.generateSavedItem({
        project
      });
      assert.deepEqual(result.projects, [project]);
    });

    it('Type property is set', () => {
      const result = gen.generateSavedItem();
      assert.equal(result.type, 'saved');
    });

    it('Has no driveId when noGoogleDrive is set', () => {
      const result = gen.generateSavedItem({
        noGoogleDrive: true
      });
      assert.isUndefined(result.driveId);
    });
  });

  describe('generateHistoryObject()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateHistoryObject();
      assert.typeOf(result, 'object');
    });

    [
      'generateIsPayload',
      'generateMethod',
      'generateHeaders',
      'generatePayload'
    ].forEach((method) => {
      it(`Calls ${method}()`, () => {
        // @ts-ignore
        const spy = sinon.spy(gen, method);
        gen.generateHistoryObject();
        assert.isTrue(spy.called);
      });
    });

    it('Calls generateContentType()', () => {
      const spy = sinon.spy(gen, 'generateContentType');
      gen.generateHistoryObject({
        forcePayload: true
      });
      assert.isTrue(spy.called);
    });

    [
      ['url', 'string'],
      ['method', 'string'],
      ['headers', 'string'],
      ['created', 'number'],
      ['updated', 'number'],
      ['type', 'string'],
      ['midnight', 'number'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = gen.generateHistoryObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it('Type property is set', () => {
      const result = gen.generateHistoryObject();
      assert.equal(result.type, 'history');
    });

    it('Has no _id when noId is used', () => {
      const result = gen.generateHistoryObject({
        noId: true
      });
      assert.isUndefined(result._id);
    });
  });

  describe('pickProject()', () => {
    let gen = /** @type DataGenerator */ (null);
    let projects;
    beforeEach(() => {
      gen = new DataGenerator();
      projects = gen.generateProjects({
        projectsSize: 3,
      });
    });

    it('Always returns project id', () => {
      const result = gen.pickProject({
        projects,
        forceProject: true
      });
      assert.notEqual(projects.indexOf(result), -1);
    });

    it('May return project id', () => {
      const result = gen.pickProject({
        projects
      });
      if (result === undefined) {
        return;
      }
      assert.notEqual(projects.indexOf(result), -1);
    });

    it('Returns undefined when no project', () => {
      const result = gen.pickProject();
      assert.isUndefined(result);
    });
  });

  describe('generateRequests()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateRequests();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = gen.generateRequests();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of requests', () => {
      const result = gen.generateRequests({
        requestsSize: 10
      });
      assert.lengthOf(result, 10);
    });

    it('Calls pickProject()', () => {
      const spy = sinon.spy(gen, 'pickProject');
      gen.generateRequests({
        requestsSize: 10
      });
      assert.equal(spy.callCount, 10);
    });

    it('Calls generateSavedItem()', () => {
      const spy = sinon.spy(gen, 'generateSavedItem');
      gen.generateRequests({
        requestsSize: 10
      });
      assert.equal(spy.callCount, 10);
    });

    it('Adds project to the request', () => {
      const projects = [{ _id: '1', name: 'x', description: 'y', order: 1, requests: [] }];
      const result = gen.generateRequests({
        requestsSize: 2,
        forceProject: true,
        projects
      });

      assert.deepEqual(result[0].projects, ['1']);
    });

    it('Adds request to the project', () => {
      const projects = [{ _id: '1', name: 'x', description: 'y', order: 1, requests: [] }];
      gen.generateRequests({
        requestsSize: 2,
        forceProject: true,
        projects,
      });

      assert.typeOf(projects[0].requests[0], 'string');
    });
  });

  describe('generateProjects()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateProjects();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = gen.generateProjects();
      assert.lengthOf(result, 5);
    });

    it('Returns requested number of requests', () => {
      const result = gen.generateProjects({
        projectsSize: 10
      });
      assert.lengthOf(result, 10);
    });

    it('Calls createProjectObject()', () => {
      const spy = sinon.spy(gen, 'createProjectObject');
      gen.generateProjects({
        projectsSize: 10
      });
      assert.equal(spy.callCount, 10);
    });
  });

  describe('generateSavedRequestData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateSavedRequestData();
      assert.typeOf(result, 'object');
    });

    it('Calls generateProjects()', () => {
      const spy = sinon.spy(gen, 'generateProjects');
      gen.generateSavedRequestData();
      assert.isTrue(spy.called);
    });

    it('Calls generateRequests()', () => {
      const spy = sinon.spy(gen, 'generateRequests');
      gen.generateSavedRequestData();
      assert.isTrue(spy.called);
    });

    it('Passes options to generateProjects()', () => {
      const result = gen.generateSavedRequestData({
        projectsSize: 1
      });
      assert.lengthOf(result.projects, 1);
    });

    it('Passes options to generateRequests()', () => {
      const result = gen.generateSavedRequestData({
        requestsSize: 1
      });
      assert.lengthOf(result.requests, 1);
    });
  });

  describe('generateHistoryRequestsData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateHistoryRequestsData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = gen.generateHistoryRequestsData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of requests', () => {
      const result = gen.generateHistoryRequestsData({
        requestsSize: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls createProjectObject()', () => {
      const spy = sinon.spy(gen, 'generateHistoryObject');
      gen.generateHistoryRequestsData({
        requestsSize: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateVariableObject()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateVariableObject();
      assert.typeOf(result, 'object');
    });

    [
      ['enabled', 'boolean'],
      ['value', 'string'],
      ['name', 'string'],
      ['_id', 'string'],
      ['environment', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = gen.generateVariableObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it('Always creates "default" environment', () => {
      const result = gen.generateVariableObject({
        defaultEnv: true
      });
      assert.equal(result.environment, 'default');
    });

    it('Always creates random environment', () => {
      const result = gen.generateVariableObject({
        randomEnv: true
      });
      assert.notEqual(result.environment, 'default');
    });
  });

  describe('generateVariablesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateVariablesData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = gen.generateVariablesData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of variables', () => {
      const result = gen.generateVariablesData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateVariableObject()', () => {
      const spy = sinon.spy(gen, 'generateVariableObject');
      gen.generateVariablesData({
        size: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateCookieObject()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    it('Returns an object', () => {
      const result = gen.generateCookieObject();
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
        const result = gen.generateCookieObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('generateCookiesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateCookiesData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = gen.generateCookiesData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = gen.generateCookiesData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateHeaderSetObject()', () => {
      const spy = sinon.spy(gen, 'generateCookieObject');
      gen.generateCookiesData({
        size: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateUrlObject()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateUrlObject();
      assert.typeOf(result, 'object');
    });

    [
      ['time', 'number'],
      ['cnt', 'number'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = gen.generateUrlObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('generateUrlsData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateUrlsData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = gen.generateUrlsData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = gen.generateUrlsData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateUrlObject()', () => {
      const spy = sinon.spy(gen, 'generateUrlObject');
      gen.generateUrlsData({
        size: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateHostRuleObject()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateHostRuleObject();
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
        const result = gen.generateHostRuleObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('generateHostRulesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateHostRulesData();
      assert.typeOf(result, 'array');
    });

    it('List has default number of requests', () => {
      const result = gen.generateHostRulesData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = gen.generateHostRulesData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateHostRuleObject()', () => {
      const spy = sinon.spy(gen, 'generateHostRuleObject');
      gen.generateHostRulesData({
        size: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateBasicAuthObject()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateBasicAuthObject();
      assert.typeOf(result, 'object');
    });

    [
      ['_id', 'string'],
      ['type', 'String'],
      ['url', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = gen.generateBasicAuthObject();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it('Type is "basic"', () => {
      const result = gen.generateBasicAuthObject();
      assert.equal(result.type, 'basic');
    });

    it('_id starts with "basic?"', () => {
      const result = gen.generateBasicAuthObject();
      assert.equal(result._id.indexOf('basic/'), 0);
    });
  });

  describe('generateBasicAuthData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('returns an array', () => {
      const result = gen.generateBasicAuthData();
      assert.typeOf(result, 'array');
    });

    it('the list has default number of requests', () => {
      const result = gen.generateBasicAuthData();
      assert.lengthOf(result, 25);
    });

    it('Returns requested number of items', () => {
      const result = gen.generateBasicAuthData({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateHostRuleObject()', () => {
      const spy = sinon.spy(gen, 'generateBasicAuthObject');
      gen.generateBasicAuthData({
        size: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateApiIndex()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateApiIndex();
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
        const result = gen.generateApiIndex();
        assert.typeOf(result[property], type);
      });
    });

    it('generate versionsSize versions', () => {
      const result = gen.generateApiIndex({
        versionSize: 10,
      });
      assert.lengthOf(result.versions, 10);
    });
  });

  describe('generateApiIndexList()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('returns an array', () => {
      const result = gen.generateApiIndexList();
      assert.typeOf(result, 'array');
    });

    it('has size items', () => {
      const result = gen.generateApiIndexList({
        size: 10
      });
      assert.lengthOf(result, 10);
    });

    it('calls generateApiIndex() for each item', () => {
      const spy = sinon.spy(gen, 'generateApiIndex');
      gen.generateApiIndexList({
        size: 2
      });
      assert.equal(spy.callCount, 2);
    });
  });

  describe('generateApiData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const index = gen.generateApiIndex();
      const result = gen.generateApiData(index);
      assert.typeOf(result, 'array');
    });

    [
      ['_id', 'string'],
      ['data', 'string'],
      ['version', 'string'],
      ['indexId', 'string']
    ].forEach(([property, type]) => {
      it(`Has ${property} property of a type ${type}`, () => {
        const index = gen.generateApiIndex();
        const result = gen.generateApiData(index)[0];
        assert.typeOf(result[property], type);
      });
    });

    it('generate an item for each version', () => {
      const index = gen.generateApiIndex({
        versionSize: 6
      });
      const result = gen.generateApiData(index);
      assert.lengthOf(result, 6);
    });
  });

  describe('generateClientCertificate()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an object', () => {
      const result = gen.generateClientCertificate();
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
        const result = gen.generateClientCertificate();
        assert.typeOf(result[prop], type);
      });
    });

    it('uses passed type', () => {
      const result = gen.generateClientCertificate({
        type: 'p12'
      });
      assert.equal(result.type, 'p12');
    });

    it('creates binary data on a certificate', () => {
      const result = gen.generateClientCertificate({
        binary: true
      });
      // @ts-ignore
      assert.typeOf(result.cert.data, 'Uint8Array');
    });

    it('adds passphrase to a certificate by default', () => {
      const result = gen.generateClientCertificate({});
      // @ts-ignore
      assert.typeOf(result.cert.passphrase, 'string');
    });

    it('ignores passphrase on a certificate', () => {
      const result = gen.generateClientCertificate({
        noPassphrase: true
      });
      // @ts-ignore
      assert.isUndefined(result.cert.passphrase);
    });
  });

  describe('generateClientCertificates()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('Returns an array', () => {
      const result = gen.generateClientCertificates();
      assert.typeOf(result, 'array');
    });

    it('List has default number of items', () => {
      const result = gen.generateClientCertificates();
      assert.lengthOf(result, 15);
    });

    it('Returns requested number of items', () => {
      const result = gen.generateClientCertificates({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('Calls generateClientCertificate()', () => {
      const spy = sinon.spy(gen, 'generateClientCertificate');
      gen.generateClientCertificates({
        size: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('certificateToStore()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('returns the same cert when data is string', () => {
      const cert = gen.generateCertificate({
        binary: false,
      });
      const result = gen.certificateToStore(cert);
      assert.deepEqual(result, cert);
    });

    it('transfers buffer data to string', () => {
      const cert = gen.generateCertificate({
        binary: true,
      });
      const result = gen.certificateToStore(cert);
      assert.notDeepEqual(result, cert, 'returns altered object');
      assert.typeOf(result.data, 'string', 'cert data is a string');
      assert.equal(result.type, 'buffer', 'adds type property');
    });
  });

  describe('generateExportClientCertificate()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('returns an object', () => {
      const result = gen.generateExportClientCertificate();
      assert.typeOf(result, 'object');
    });

    it('calls generateClientCertificate()', () => {
      const spy = sinon.spy(gen, 'generateClientCertificate');
      gen.generateExportClientCertificate();
      assert.isTrue(spy.calledOnce);
    });

    it('adds kind property', () => {
      const result = gen.generateExportClientCertificate();
      assert.equal(result.kind, 'ARC#ClientCertificate');
    });

    it('adds key property', () => {
      const result = gen.generateExportClientCertificate();
      assert.typeOf(result.key, 'string');
    });

    it('moves old key to pKey property', () => {
      const result = gen.generateExportClientCertificate();
      assert.typeOf(result.pKey, 'object');
    });

    it('ignores pKey when nmo key data', () => {
      const result = gen.generateExportClientCertificate({
        noKey: true,
      });
      assert.isUndefined(result.pKey);
    });
  });

  describe('generateExportClientCertificates()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('returns an array', () => {
      const result = gen.generateExportClientCertificates();
      assert.typeOf(result, 'array');
    });

    it('has the default number of items', () => {
      const result = gen.generateExportClientCertificates();
      assert.lengthOf(result, 15);
    });

    it('returns requested number of items', () => {
      const result = gen.generateExportClientCertificates({
        size: 5
      });
      assert.lengthOf(result, 5);
    });

    it('calls generateExportClientCertificate()', () => {
      const spy = sinon.spy(gen, 'generateExportClientCertificate');
      gen.generateExportClientCertificates({
        size: 5
      });
      assert.equal(spy.callCount, 5);
    });
  });

  describe('generateHarTimings()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    [
      'blocked', 'connect', 'receive', 'send', 'wait', 'dns',
    ].forEach((name) => {
      it(`has ${name} property`, () => {
        const result = gen.generateHarTimings();
        assert.typeOf(result[name], 'number');
      });
    });

    it('has no ssl property by default', () => {
      const result = gen.generateHarTimings();
      assert.isUndefined(result.ssl);
    });

    it('adds ssl property', () => {
      const result = gen.generateHarTimings({ ssl: true });
      assert.typeOf(result.ssl, 'number');
    });
  });

  describe('generateRedirectStatus()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    it('returns valid status code', () => {
      const result = gen.generateRedirectStatus();
      assert.typeOf(result.code, 'number', 'code is a number');
      assert.include(gen.redirectCodes, result.code, 'code is a redirect code');
    });

    it('uses passed code', () => {
      const result = gen.generateRedirectStatus({ code: 999 });
      assert.equal(result.code, 999);
    });

    it('returns the status', () => {
      const result = gen.generateRedirectStatus();
      assert.typeOf(result.status, 'string', 'status is a string');
    });

    it('returns the passed status', () => {
      const result = gen.generateRedirectStatus({ status: 'test' });
      assert.equal(result.status, 'test');
    });
  });

  describe('generateRedirectResponse()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    [
      ['response', 'object'],
      ['startTime', 'number'],
      ['endTime', 'number'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property by default`, () => {
        const result = gen.generateRedirectResponse();
        assert.typeOf(result[prop], type);
      });
    });

    it('has no timings property by default', () => {
      const result = gen.generateRedirectResponse();
      assert.isUndefined(result.timings);
    });

    it('add the timings property', () => {
      const result = gen.generateRedirectResponse({ timings: true });
      assert.typeOf(result.timings, 'object');
    });

    [
      ['status', 'number'],
      ['statusText', 'string'],
      ['headers', 'string'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property on the response`, () => {
        const result = gen.generateRedirectResponse();
        assert.typeOf(result.response[prop], type);
      });
    });

    it('has the location property on the headers', () => {
      const result = gen.generateRedirectResponse();
      assert.include(result.response.headers, 'location: ');
    });

    it('has the payload property on the request', () => {
      const result = gen.generateRedirectResponse({ body: true });
      assert.typeOf(result.response.payload, 'string');
    });

    it('ignores the payload when not in options', () => {
      const result = gen.generateRedirectResponse();
      assert.isUndefined(result.response.payload, 'string');
    });

    it('has the timings property', () => {
      const result = gen.generateRedirectResponse({ timings: true });
      assert.typeOf(result.timings, 'object');
    });
  });

  describe('generateResponse()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    [
      ['status', 'number'],
      ['statusText', 'string'],
      ['headers', 'string'],
      ['payload', 'string'],
      ['loadingTime', 'number'],
      ['size', 'object'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property by default`, () => {
        const result = gen.generateResponse();
        assert.typeOf(result[prop], type);
      });
    });

    it('ignores the payload when in options', () => {
      const result = gen.generateResponse({ noBody: true });
      assert.isUndefined(result.payload);
    });

    it('ignores the size when in options', () => {
      const result = gen.generateResponse({ noSize: true });
      assert.isUndefined(result.size);
    });

    it('has the timings property', () => {
      const result = gen.generateResponse({ timings: true });
      assert.typeOf(result.timings, 'object');
    });

    it('has the redirects property', () => {
      const result = gen.generateResponse({ redirects: true });
      assert.typeOf(result.redirects, 'array');
    });

    it('has the specific response group', () => {
      let result = gen.generateResponse({ statusGroup: 2 });
      assert.isAbove(result.status, 199);
      assert.isBelow(result.status, 300);
      result = gen.generateResponse({ statusGroup: 3 });
      assert.isAbove(result.status, 299);
      assert.isBelow(result.status, 400);
    });
  });

  describe('generateErrorResponse()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    [
      ['error', 'error'],
      ['status', 'number'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property by default`, () => {
        const result = gen.generateErrorResponse();
        assert.typeOf(result[prop], type);
      });
    });
  });

  describe('insertSavedIfNotExists()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroySavedRequestData();
    });

    it('Inserts new saved request data', async () => {
      await gen.insertSavedIfNotExists();
      const savedDb = new PouchDB('saved-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 25);
    });

    it('Inserts new projects data', async () => {
      await gen.insertSavedIfNotExists();
      const savedDb = new PouchDB('legacy-projects');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 5);
    });

    it('Returns generated data', async () => {
      const result = await gen.insertSavedIfNotExists();
      assert.lengthOf(result.requests, 25, 'Has requests array');
      assert.lengthOf(result.projects, 5, 'Has projects array');

      assert.typeOf(result.requests[0]._id, 'string', 'Request has _id');
      assert.typeOf(result.requests[0]._rev, 'string', 'Request has _rev');

      assert.typeOf(result.projects[0]._id, 'string', 'Project has _id');
      assert.typeOf(result.projects[0]._rev, 'string', 'Project has _rev');
    });

    it('Ignores insert of requests when exists', async () => {
      const insert = await gen.insertSavedRequestData({
        // More than 1 can cause order problems
        // Retrieved from the data store documents may be in different order
        // so it's safer to test single request to reduce tests logic
        requestsSize: 1
      });

      const result = await gen.insertSavedIfNotExists();
      assert.deepEqual(result.requests, insert.requests);
    });

    it('Ignores insert of projects when exists', async () => {
      const insert = await gen.insertSavedRequestData({
        requestsSize: 1,
        projectsSize: 1
      });
      const result = await gen.insertSavedIfNotExists();
      assert.deepEqual(result.projects, insert.projects);
    });
  });

  describe('insertHistoryIfNotExists()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyHistoryData();
    });

    it('Inserts new history request data', async () => {
      await gen.insertHistoryIfNotExists();
      const savedDb = new PouchDB('history-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 25);
    });

    it('Returns generated data', async () => {
      const result = await gen.insertHistoryIfNotExists();
      assert.lengthOf(result, 25, 'Has requests list');

      assert.typeOf(result[0]._id, 'string', 'Request has _id');
      assert.typeOf(result[0]._rev, 'string', 'Request has _rev');
    });

    it('Ignores insert of requests when exists', async () => {
      const insert = await gen.insertHistoryRequestData({
        // More than 1 can cause order problems
        // Retrieved from the data store documents may be in different order
        // so it's safer to test single request to reduce tests logic
        requestsSize: 1
      });

      const result = await gen.insertHistoryIfNotExists();
      assert.deepEqual(result, insert);
    });
  });

  describe('insertSavedRequestData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroySavedRequestData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertSavedRequestData();

      assert.lengthOf(result.requests, 25, 'Has requests array');
      assert.lengthOf(result.projects, 5, 'Has projects array');
    });

    it('Project has updated _rev', async () => {
      const result = await gen.insertSavedRequestData({
        projectsSize: 1,
        requestsSize: 1
      });

      assert.typeOf(result.projects[0]._id, 'string', 'Project has _id');
      assert.typeOf(result.projects[0]._rev, 'string', 'Project has _rev');
    });

    it('Request has updated _rev', async () => {
      const result = await gen.insertSavedRequestData({
        projectsSize: 1,
        requestsSize: 1
      });

      assert.typeOf(result.requests[0]._id, 'string', 'Request has _id');
      assert.typeOf(result.requests[0]._rev, 'string', 'Request has _rev');
    });

    it('Calls generateSavedRequestData()', async () => {
      const spy = sinon.spy(gen, 'generateSavedRequestData');
      await gen.insertSavedRequestData({
        projectsSize: 1,
        requestsSize: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertHistoryRequestData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyHistoryData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertHistoryRequestData();
      assert.lengthOf(result, 25);
    });

    it('Request has updated _rev', async () => {
      const result = await gen.insertHistoryRequestData({
        requestsSize: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Request has _id');
      assert.typeOf(result[0]._rev, 'string', 'Request has _rev');
    });

    it('Calls generateHistoryRequestsData()', async () => {
      const spy = sinon.spy(gen, 'generateHistoryRequestsData');
      await gen.insertHistoryRequestData({
        requestsSize: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertProjectsData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.clearLegacyProjects();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertProjectsData();
      assert.lengthOf(result, 5);
    });

    it('Object has updated _rev', async () => {
      const result = await gen.insertProjectsData({
        projectsSize: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateProjects()', async () => {
      const spy = sinon.spy(gen, 'generateProjects');
      await gen.insertProjectsData({
        projectsSize: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertWebsocketData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyWebsocketsData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertWebsocketData();
      assert.lengthOf(result, 25);
    });

    it('Request has updated _rev', async () => {
      const result = await gen.insertWebsocketData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Object generateUrlsData()', async () => {
      const spy = sinon.spy(gen, 'generateUrlsData');
      await gen.insertWebsocketData({
        size: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertUrlHistoryData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    beforeEach(async () => {
      await gen.destroyUrlData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertUrlHistoryData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await gen.insertUrlHistoryData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateUrlsData()', async () => {
      const spy = sinon.spy(gen, 'generateUrlsData');
      await gen.insertUrlHistoryData({
        size: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertVariablesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyVariablesData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertVariablesData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await gen.insertVariablesData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateVariablesData()', async () => {
      const spy = sinon.spy(gen, 'generateVariablesData');
      await gen.insertVariablesData({
        size: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertCookiesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyCookiesData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertCookiesData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await gen.insertCookiesData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateCookiesData()', async () => {
      const spy = sinon.spy(gen, 'generateCookiesData');
      await gen.insertCookiesData({
        size: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertBasicAuthData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyAuthData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertBasicAuthData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await gen.insertBasicAuthData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateBasicAuthData()', async () => {
      const spy = sinon.spy(gen, 'generateBasicAuthData');
      await gen.insertBasicAuthData({
        size: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertHostRulesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyHostRulesData();
    });

    it('Returns generated data', async () => {
      const result = await gen.insertHostRulesData();
      assert.lengthOf(result, 25);
    });

    it('Object has updated _rev', async () => {
      const result = await gen.insertHostRulesData({
        size: 1
      });

      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateHostRulesData()', async () => {
      const spy = sinon.spy(gen, 'generateHostRulesData');
      await gen.insertHostRulesData({
        size: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertApiData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyAllApiData();
    });

    it('returns generated data', async () => {
      const result = await gen.insertApiData();
      assert.lengthOf(result[0], 25);
      assert.isAbove(result[1].length, 25);
    });

    it('object has updated _rev', async () => {
      const result = await gen.insertApiData({
        size: 1,
      });
      assert.typeOf(result[0][0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0][0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateApiIndexList()', async () => {
      const spy = sinon.spy(gen, 'generateApiIndexList');
      await gen.insertApiData({
        size: 1,
      });
      assert.isTrue(spy.called);
    });

    it('Calls generateApiDataList()', async () => {
      const spy = sinon.spy(gen, 'generateApiDataList');
      await gen.insertApiData({
        size: 1,
      });
      assert.isTrue(spy.called);
    });
  });

  describe('insertCertificatesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.destroyClientCertificates();
    });

    it('returns generated data', async () => {
      const result = await gen.insertCertificatesData();
      assert.lengthOf(result, 15);
    });

    it('object has updated _rev', async () => {
      const result = await gen.insertCertificatesData({
        size: 1
      });
      assert.typeOf(result[0]._id, 'string', 'Object has _id');
      assert.typeOf(result[0]._rev, 'string', 'Object has _rev');
    });

    it('Calls generateClientCertificates()', async () => {
      const spy = sinon.spy(gen, 'generateClientCertificates');
      await gen.insertCertificatesData({
        size: 1
      });
      assert.isTrue(spy.called);
    });
  });

  describe('destroySavedRequestData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });

    beforeEach(async () => {
      await gen.insertSavedRequestData();
    });

    it('Clears saved-requests store', async () => {
      await gen.destroySavedRequestData();
      const savedDb = new PouchDB('saved-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });

    it('Clears legacy-requests store', async () => {
      await gen.destroySavedRequestData();
      const db = new PouchDB('legacy-requests');
      const response = await db.allDocs();
      assert.equal(response.total_rows, 0);
    });
  });

  describe('destroyHistoryData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertHistoryRequestData();
    });

    it('Clears history-requests store', async () => {
      await gen.destroyHistoryData();
      const savedDb = new PouchDB('history-requests');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('clearLegacyProjects()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertProjectsData();
    });

    it('Clears legacy-projects store', async () => {
      await gen.clearLegacyProjects();
      const savedDb = new PouchDB('legacy-projects');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyWebsocketsData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertWebsocketData();
    });

    it('Clears websocket-url-history store', async () => {
      await gen.destroyWebsocketsData();
      const savedDb = new PouchDB('websocket-url-history');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyUrlData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertUrlHistoryData();
    });

    it('Clears url-history store', async () => {
      await gen.destroyUrlData();
      const savedDb = new PouchDB('url-history');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyVariablesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertVariablesData();
    });

    it('Clears variables store', async () => {
      await gen.destroyVariablesData();
      const savedDb = new PouchDB('variables');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });

    it('Clears variables-environments store', async () => {
      await gen.destroyVariablesData();
      const savedDb = new PouchDB('variables-environments');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyCookiesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertCookiesData();
    });

    it('Clears cookies store', async () => {
      await gen.destroyCookiesData();
      const savedDb = new PouchDB('cookies');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyAuthData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertBasicAuthData();
    });

    it('Clears auth-data store', async () => {
      await gen.destroyAuthData();
      const savedDb = new PouchDB('auth-data');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyHostRulesData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      await gen.insertHostRulesData();
    });

    it('Clears host-rules store', async () => {
      await gen.destroyHostRulesData();
      const savedDb = new PouchDB('host-rules');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyApiIndexData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      const db = new PouchDB('api-index');
      await db.put({ _id: `test-${Date.now()}` });
    });

    it('Clears api-index store', async () => {
      await gen.destroyApiIndexData();
      const savedDb = new PouchDB('api-index');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyApiData()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      const db = new PouchDB('api-data');
      await db.put({ _id: `test-${Date.now()}` });
    });

    it('Clears api-index store', async () => {
      await gen.destroyApiData();
      const savedDb = new PouchDB('api-data');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyClientCertificates()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    
    beforeEach(async () => {
      const db = new PouchDB('client-certificates');
      await db.put({ _id: `test-${Date.now()}` });
    });

    it('Clears client-certificates store', async () => {
      await gen.destroyClientCertificates();
      const savedDb = new PouchDB('client-certificates');
      const docs = await savedDb.allDocs();
      assert.equal(docs.total_rows, 0);
    });
  });

  describe('destroyAll()', () => {
    let gen = /** @type DataGenerator */ (null);
    const spies = [];
    const fns = [
      'destroySavedRequestData',
      'destroyHistoryData',
      'destroyWebsocketsData',
      'destroyUrlData',
      'destroyVariablesData',
      'destroyCookiesData',
      'destroyAuthData',
      'destroyHostRulesData',
      'destroyApiIndexData',
      'destroyApiData'
    ];

    before(async () => {
      gen = new DataGenerator();
      fns.forEach((fn) => {
        // @ts-ignore
        const spy = sinon.spy(gen, fn);
        spies.push(spy);
      });
      await gen.destroyAll();
      fns.forEach((fn) => {
        gen[fn].restore();
      });
    });

    fns.forEach((fn, index) => {
      it(`Calls ${fn}()`, async () => {
        assert.isTrue(spies[index].called);
      });
    });
  });

  describe('clone()', () => {
    let gen = /** @type DataGenerator */ (null);
    beforeEach(() => {
      gen = new DataGenerator();
    });
    

    it('Creates a copy', () => {
      const src = {
        a: 'true'
      };
      const result = gen.clone(src);
      assert.deepEqual(result, src);
      assert.isFalse(result === src);
    });

    it('Handles Date Object', () => {
      const d = new Date();
      const src = {
        a: d
      };
      const result = gen.clone(src);
      assert.equal(result.a.getTime(), src.a.getTime());
      assert.isFalse(result.a === d);
    });

    it('Handles Array', () => {
      const src = ['a', 'b', { inner: true }, ['inner']];
      const result = gen.clone(src);
      assert.deepEqual(result, src);
      assert.isFalse(result === src);
    });
  });

  describe('Data getters', () => {
    let gen = /** @type DataGenerator */ (null);
    before(async () => {
      gen = new DataGenerator();
      await gen.destroyAll();
    });

    after(() => gen.destroyAll());

    [
      ['getDatastoreRequestData', 'insertSavedRequestData', 25],
      ['getDatastoreProjectsData', 'insertProjectsData', 10],
      ['getDatastoreHistoryData', 'insertHistoryRequestData', 25],
      ['getDatastoreVariablesData', 'insertVariablesData', 25],
      ['getDatastoreWebsocketsData', 'insertWebsocketData', 25],
      ['getDatastoreUrlsData', 'insertUrlHistoryData', 25],
      ['getDatastoreAuthData', 'insertBasicAuthData', 25],
      ['getDatastoreHostRulesData', 'insertHostRulesData', 25],
      ['getDatastoreCookiesData', 'insertCookiesData', 25],
      ['getDatastoreApiIndexData', 'insertApiData', 25],
    ].forEach(([getFn, insertFn, size]) => {
      it(`${getFn}() returns the data`, async () => {
        await gen[insertFn]();
        const data = await gen[getFn]();
        assert.typeOf(data, 'array');
        assert.lengthOf(data, Number(size));
      });
    });

    it(`getDatastoreClientCertificates() returns the data`, async () => {
      await gen.insertCertificatesData();
      const data = await gen.getDatastoreClientCertificates();
      assert.typeOf(data, 'array');
      assert.lengthOf(data, 2, 'has both results');
      const [certs, cData] = data;
      assert.lengthOf(certs, 15, 'has certificates list');
      assert.lengthOf(cData, 15, 'has certificates data list');
    });

    it(`getDatastoreHostApiData() returns the data`, async () => {
      await gen.destroyApiData();
      await gen.insertApiData({
        versionSize: 1,
      });
      const data = await gen.getDatastoreHostApiData();
      assert.typeOf(data, 'array');
      assert.lengthOf(data, 25, 'has both results');
    });
  });
});
