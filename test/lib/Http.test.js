import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { Http } from '../../index.js';

/** @typedef {import('@advanced-rest-client/events').Project.ARCProject} ARCProject */

describe('Http', () => {
  describe('project()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an object', () => {
      const result = http.project();
      assert.typeOf(result, 'object');
    });

    it('has the kind', () => {
      const result = http.project();
      assert.equal(result.kind, 'ARC#Project');
    });

    it('has the _id', () => {
      const result = http.project();
      assert.typeOf(result._id, 'string');
    });

    it('has the name', () => {
      const result = http.project();
      assert.typeOf(result.name, 'string');
    });

    it('has the order', () => {
      const result = http.project();
      assert.typeOf(result.order, 'number');
    });

    it('has the description', () => {
      const result = http.project();
      assert.typeOf(result.description, 'string');
    });

    it('has the requests', () => {
      const result = http.project();
      assert.typeOf(result.requests, 'array');
      assert.lengthOf(result.requests, 0);
    });

    it('adds passed requestId', () => {
      const result = http.project({
        requestId: 'test'
      });
      assert.deepEqual(result.requests, ['test']);
    });

    it('auto-generates request id', () => {
      const result = http.project({
        autoRequestId: true
      });
      assert.typeOf(result.requests[0], 'string');
    });

    it('has the default folders', () => {
      const result = http.project();
      assert.typeOf(result.folders, 'array');
      assert.lengthOf(result.folders, 0);
    });

    it('adds the passed configured size of folders', () => {
      const result = http.project({
        folder: {
          size: 10,
        }
      });
      assert.typeOf(result.folders, 'array');
      assert.lengthOf(result.folders, 10);
    });

    it('adds a request to the folders', () => {
      const result = http.project({
        folder: {
          size: 2,
          autoRequestId: true,
        }
      });
      assert.typeOf(result.folders, 'array');
      const [f1, f2] = result.folders;
      assert.lengthOf(f1.requests, 1);
      assert.lengthOf(f2.requests, 1);
    });
  });

  describe('projectFolder()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an object', () => {
      const result = http.projectFolder();
      assert.typeOf(result, 'object');
    });

    it('has the kind', () => {
      const result = http.projectFolder();
      assert.equal(result.kind, 'ARC#ProjectFolder');
    });

    it('has the name', () => {
      const result = http.projectFolder();
      assert.typeOf(result.name, 'string');
    });

    it('has the description', () => {
      const result = http.projectFolder();
      assert.typeOf(result.description, 'string');
    });

    it('has the created', () => {
      const result = http.projectFolder();
      assert.typeOf(result.created, 'number');
    });

    it('has the updated', () => {
      const result = http.projectFolder();
      assert.typeOf(result.updated, 'number');
    });

    it('has the requests', () => {
      const result = http.projectFolder();
      assert.typeOf(result.requests, 'array');
      assert.lengthOf(result.requests, 0);
    });

    it('adds passed requestId', () => {
      const result = http.projectFolder({
        requestId: 'test'
      });
      assert.deepEqual(result.requests, ['test']);
    });

    it('auto-generates request id', () => {
      const result = http.projectFolder({
        autoRequestId: true
      });
      assert.typeOf(result.requests[0], 'string');
    });

    it('has the default folders', () => {
      const result = http.projectFolder();
      assert.typeOf(result.folders, 'array');
      assert.lengthOf(result.folders, 0);
    });

    it('adds the passed configured size of folders', () => {
      const result = http.projectFolder({
        folder: {
          size: 10,
        }
      });
      assert.typeOf(result.folders, 'array');
      assert.lengthOf(result.folders, 10);
    });

    it('adds a request to the folders', () => {
      const result = http.projectFolder({
        folder: {
          size: 2,
          autoRequestId: true,
        }
      });
      assert.typeOf(result.folders, 'array');
      const [f1, f2] = result.folders;
      assert.lengthOf(f1.requests, 1);
      assert.lengthOf(f2.requests, 1);
    });
  });

  describe('description()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns a string', () => {
      const result = http.description();
      if (result === undefined) {
        // there's 30% chance that generated value is undefined
        return;
      }
      assert.typeOf(result, 'string');
    });

    it('always returns undefined for noDescription', () => {
      const result = http.description({
        noDescription: true
      });
      assert.isUndefined(result);
    });

    it('always returns value for forceDescription', () => {
      const result = http.description({
        forceDescription: true
      });
      assert.typeOf(result, 'string');
    });
  });

  describe('saved()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an object', () => {
      const result = http.saved();
      assert.typeOf(result, 'object');
    });

   [
      ['url', 'string'],
      ['method', 'string'],
      ['headers', 'string'],
      ['created', 'number'],
      ['updated', 'number'],
      ['type', 'string'],
      ['name', 'string'],
      ['midnight', 'number'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`has ${item[0]} property of a type ${item[1]}`, () => {
        const result = http.saved();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it(`has the description property of a type string`, () => {
      const result = http.saved();
      if (result.description === undefined) {
        // there's 30% chance that generated value is undefined
        return;
      }
      assert.typeOf(result.description, 'string');
    });

    it('adds a project', () => {
      const project = 'a';
      const result = http.saved({
        project,
      });
      assert.deepEqual(result.projects, [project]);
    });

    it('sets the type property', () => {
      const result = http.saved();
      assert.equal(result.type, 'saved');
    });
  });

  describe('history()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an object', () => {
      const result = http.history();
      assert.typeOf(result, 'object');
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
      it(`has ${item[0]} property of a type ${item[1]}`, () => {
        const result = http.history();
        assert.typeOf(result[item[0]], item[1]);
      });
    });

    it('has the type property', () => {
      const result = http.history();
      assert.equal(result.type, 'history');
    });

    it('has no _id with noId option', () => {
      const result = http.history({
        noId: true
      });
      assert.isUndefined(result._id);
    });
  });

  describe('listHistory()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an array', () => {
      const result = http.listHistory();
      assert.typeOf(result, 'array');
    });

    it('has the default number of requests', () => {
      const result = http.listHistory();
      assert.lengthOf(result, 25);
    });

    it('has requested number of requests', () => {
      const result = http.listHistory(5);
      assert.lengthOf(result, 5);
    });

    it('calls history()', () => {
      const spy = sinon.spy(http, 'history');
      http.listHistory(5);
      assert.equal(spy.callCount, 5);
    });
  });

  describe('pickProject()', () => {
    /** @type Http */
    let http;
    /** @type ARCProject[] */
    let projects;

    before(() => { 
      http = new Http(); 
      projects = http.listProjects(3);
    });

    it('always returns project id', () => {
      const result = http.pickProject({
        projects,
        forceProject: true
      });
      assert.notEqual(projects.indexOf(result), -1);
    });

    it('may return project id', () => {
      const result = http.pickProject({
        projects
      });
      if (result === undefined) {
        return;
      }
      assert.notEqual(projects.indexOf(result), -1);
    });

    it('returns undefined when no project', () => {
      const result = http.pickProject();
      assert.isUndefined(result);
    });
  });

  describe('listSaved()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an array', () => {
      const result = http.listSaved();
      assert.typeOf(result, 'array');
    });

    it('list has default number of requests', () => {
      const result = http.listSaved();
      assert.lengthOf(result, 25);
    });

    it('returns requested number of requests', () => {
      const result = http.listSaved(10);
      assert.lengthOf(result, 10);
    });

    it('calls the pickProject()', () => {
      const spy = sinon.spy(http, 'pickProject');
      http.listSaved(10);
      assert.equal(spy.callCount, 10);
    });

    it('calls saved()', () => {
      const spy = sinon.spy(http, 'saved');
      http.listSaved(10);
      assert.equal(spy.callCount, 10);
    });

    it('adds project to the request', () => {
      const projects = /** @type ARCProject[] */ ([{ _id: '1', name: 'x', description: 'y', order: 1, requests: [], folders: [], kind: 'ARC#Project' }]);
      const result = http.listSaved(2, {
        forceProject: true,
        projects,
      });

      assert.deepEqual(result[0].projects, ['1']);
    });

    it('adds request to the project', () => {
      const projects = /** @type ARCProject[] */ ([{ _id: '1', name: 'x', description: 'y', order: 1, requests: [], folders: [], kind: 'ARC#Project' }]);
      http.listSaved(2, {
        forceProject: true,
        projects,
      });

      assert.typeOf(projects[0].requests[0], 'string');
    });
  });

  describe('listProjects()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an array', () => {
      const result = http.listProjects();
      assert.typeOf(result, 'array');
    });

    it('has default number of requests', () => {
      const result = http.listProjects();
      assert.lengthOf(result, 5);
    });

    it('has requested number of requests', () => {
      const result = http.listProjects(10);
      assert.lengthOf(result, 10);
    });

    it('calls project()', () => {
      const spy = sinon.spy(http, 'project');
      http.listProjects(10);
      assert.equal(spy.callCount, 10);
    });
  });

  describe('savedData()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    it('returns an object', () => {
      const result = http.savedData();
      assert.typeOf(result, 'object');
    });

    it('calls listProjects()', () => {
      const spy = sinon.spy(http, 'listProjects');
      http.savedData();
      assert.equal(spy.callCount, 1);
    });

    it('calls listSaved()', () => {
      const spy = sinon.spy(http, 'listSaved');
      http.savedData();
      assert.equal(spy.callCount, 1);
    });

    it('passes the size argument to the listProjects()', () => {
      const result = http.savedData(2, 1);
      assert.lengthOf(result.projects, 1);
    });

    it('passes the size argument to listSaved()', () => {
      const result = http.savedData(2, 1);
      assert.lengthOf(result.requests, 2);
    });
  });

  describe('transportRequest()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    [
      ['url', 'string'],
      ['method', 'string'],
      ['startTime', 'number'],
      ['endTime', 'number'],
      ['headers', 'string'],
      // ['payload', 'string'],
      ['httpMessage', 'string'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property by default`, () => {
        const result = http.transportRequest();
        assert.typeOf(result[prop], type);
      });
    });

    it('has no body when requested', () => {
      const result = http.transportRequest({ payload: { noPayload: true }});
      assert.isUndefined(result.payload);
    });

    it('has the body when requested', () => {
      const result = http.transportRequest({ payload: { force: true }});
      assert.typeOf(result.payload, 'string');
    });

    it('has no httpMessage when requested', () => {
      const result = http.transportRequest({ noHttpMessage: true });
      assert.isUndefined(result.httpMessage);
    });
  });
});

describe('http#response', () => {
  describe('redirectResponse()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    [
      ['response', 'object'],
      ['startTime', 'number'],
      ['endTime', 'number'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property by default`, () => {
        const result = http.response.redirectResponse();
        assert.typeOf(result[prop], type);
      });
    });

    it('has no timings property by default', () => {
      const result = http.response.redirectResponse();
      assert.isUndefined(result.timings);
    });

    it('add the timings property', () => {
      const result = http.response.redirectResponse({ timings: true });
      assert.typeOf(result.timings, 'object');
    });

    [
      ['status', 'number'],
      ['statusText', 'string'],
      ['headers', 'string'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property on the response`, () => {
        const result = http.response.redirectResponse();
        assert.typeOf(result.response[prop], type);
      });
    });

    it('has the location property on the headers', () => {
      const result = http.response.redirectResponse();
      assert.include(result.response.headers, 'location: ');
    });

    it('has the payload property on the request', () => {
      const result = http.response.redirectResponse({ body: true });
      assert.typeOf(result.response.payload, 'string');
    });

    it('ignores the payload when not in options', () => {
      const result = http.response.redirectResponse();
      assert.isUndefined(result.response.payload, 'string');
    });

    it('has the timings property', () => {
      const result = http.response.redirectResponse({ timings: true });
      assert.typeOf(result.timings, 'object');
    });
  });

  describe('arcResponse()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    [
      ['status', 'number'],
      ['statusText', 'string'],
      ['headers', 'string'],
      ['payload', 'string'],
      ['loadingTime', 'number'],
      ['size', 'object'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property by default`, () => {
        const result = http.response.arcResponse();
        assert.typeOf(result[prop], type);
      });
    });

    it('ignores the payload when in options', () => {
      const result = http.response.arcResponse({ noBody: true });
      assert.isUndefined(result.payload);
    });

    it('ignores the size when in options', () => {
      const result = http.response.arcResponse({ noSize: true });
      assert.isUndefined(result.size);
    });

    it('has the timings property', () => {
      const result = http.response.arcResponse({ timings: true });
      assert.typeOf(result.timings, 'object');
    });

    it('has the redirects property', () => {
      const result = http.response.arcResponse({ redirects: true });
      assert.typeOf(result.redirects, 'array');
    });

    it('has the specific response group', () => {
      let result = http.response.arcResponse({ statusGroup: 2 });
      assert.isAbove(result.status, 199);
      assert.isBelow(result.status, 300);
      result = http.response.arcResponse({ statusGroup: 3 });
      assert.isAbove(result.status, 299);
      assert.isBelow(result.status, 400);
    });
  });

  describe('arcErrorResponse()', () => {
    /** @type Http */
    let http;

    before(() => { http = new Http(); });

    [
      ['error', 'error'],
      ['status', 'number'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property by default`, () => {
        const result = http.response.arcErrorResponse();
        assert.typeOf(result[prop], type);
      });
    });
  });
});
