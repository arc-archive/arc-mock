import 'pouchdb/dist/pouchdb.js';
import 'chance/dist/chance.min.js';

import { HeadersGenerator } from './HeadersGenerator.js';

/** @typedef {import('./DataGenerator').ProjectCreateOptions} ProjectCreateOptions */
/** @typedef {import('./DataGenerator').HeaderCreateOptions} HeaderCreateOptions */
/** @typedef {import('./DataGenerator').MethodCreateOptions} MethodCreateOptions */
/** @typedef {import('./DataGenerator').SavedCreateOptions} SavedCreateOptions */
/** @typedef {import('./DataGenerator').HistoryObjectOptions} HistoryObjectOptions */
/** @typedef {import('./DataGenerator').InsertSavedResult} InsertSavedResult */
/** @typedef {import('./DataGenerator').CertificateCreateOptions} CertificateCreateOptions */
/** @typedef {import('./DataGenerator').ArcCertificateObject} ArcCertificateObject */
/** @typedef {import('./DataGenerator').ArcCertificateDataObject} ArcCertificateDataObject */
/** @typedef {import('./DataGenerator').ArcExportCertificateObject} ArcExportCertificateObject */
/** @typedef {import('./DataGenerator').CookieCreateOptions} CookieCreateOptions */
/** @typedef {import('./DataGenerator').CookieObject} CookieObject */
/** @typedef {import('./DataGenerator').ApiIndexListCreateOptions} ApiIndexListCreateOptions */
/** @typedef {import('./DataGenerator').ApiIndexObject} ApiIndexObject */
/** @typedef {import('./DataGenerator').ApiDataObject} ApiDataObject */
/** @typedef {import('./DataGenerator').SizeCreateOptions} SizeCreateOptions */
/** @typedef {import('./DataGenerator').BasicAuthObject} BasicAuthObject */
/** @typedef {import('./DataGenerator').HostRuleObject} HostRuleObject */
/** @typedef {import('./DataGenerator').VariablesCreateOptions} VariablesCreateOptions */
/** @typedef {import('./DataGenerator').VariableObject} VariableObject */
/** @typedef {import('./DataGenerator').HistoryObject} HistoryObject */
/** @typedef {import('./DataGenerator').ProjectObject} ProjectObject */
/** @typedef {import('./DataGenerator').SavedObject} SavedObject */
/** @typedef {import('./DataGenerator').SavedRequestCreateOptions} SavedRequestCreateOptions */
/** @typedef {import('./DataGenerator').UrlObject} UrlObject */
/** @typedef {import('./DataGenerator').GenerateSavedResult} GenerateSavedResult */
/** @typedef {import('./DataGenerator').ArcCertificateIndexDataObject} ArcCertificateIndexDataObject */
/** @typedef {import('./DataGenerator').ArcCertificateIndexObject} ArcCertificateIndexObject */
/** @typedef {import('./DataGenerator').ResponseRedirectOptions} ResponseRedirectOptions */
/** @typedef {import('./DataGenerator').RedirectStatusOptions} RedirectStatusOptions */
/** @typedef {import('./DataGenerator').RedirectStatusObject} RedirectStatusObject */
/** @typedef {import('./DataGenerator').HarTimingsOptions} HarTimingsOptions */
/** @typedef {import('./DataGenerator').ResponseOptions} ResponseOptions */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.ResponseRedirect} ResponseRedirect */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.RequestTime} RequestTime */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.Response} Response */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.ErrorResponse} ErrorResponse */

/* global Chance, PouchDB */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

const stringPool =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export class DataGenerator {
  get payloadMethods() {
    return ['POST', 'PUT', 'DELETE', 'OPTIONS'];
  }

  get nonPayloadMethods() {
    return ['GET', 'HEAD'];
  }

  get redirectCodes() {
    return [301, 302, 303, 307, 308];
  }

  constructor() {
    this.LAST_TIME = Date.now();
    /**
     * @type {Chance.Chance}
     */
    // @ts-ignore
    this.chance = new Chance();
  }

  /**
   * Sets a midnight on the timestamp
   * @param {number} time
   * @return {number}
   */
  setMidnight(time) {
    const now = new Date(time);
    now.setHours(0, 0, 0, 0);
    return now.getTime();
  }

  /**
   * Generates a random ARC legacy project object.
   *
   * @param {ProjectCreateOptions=} opts Create options
   * @return {ProjectObject} ARC's object.
   */
  createProjectObject(opts = {}) {
    const { chance } = this;
    const project = {
      _id: chance.guid({ version: 5 }),
      name: chance.sentence({ words: 2 }),
      order: 0,
      description: chance.paragraph(),
      requests: [],
    };
    if (opts.requestId) {
      project.requests.push(opts.requestId);
    } else if (opts.autoRequestId) {
      project.requests.push(chance.guid({ version: 5 }));
    }
    return project;
  }

  /**
   * Generates HTTP headers string.
   *
   * @param {string=} contentType
   * @param {HeaderCreateOptions=} opts Configuration options:
   * - `noHeaders` (Boolean) will not generate headers string
   * (will set empty string)
   * @return {string} Valid HTTP headers string.
   */
  generateHeaders(contentType, opts = {}) {
    const { chance } = this;
    let headers = '';
    if (!opts.noHeaders) {
      const headersSize = chance.integer({
        min: 0,
        max: 10,
      });
      for (let i = 0; i < headersSize; i++) {
        headers += `X-${chance.word()}: ${chance.word()}\n`;
      }
    }
    if (contentType) {
      headers += `content-type: ${contentType}\n`;
    }
    return headers;
  }

  /**
   * Generates a HTTP method name for the request.
   *
   * @param {boolean} isPayload If true it will use `opts.methodsPools` or
   * `payloadMethods` to pick a method from. Otherwise it will use
   * `nonPayloadMethods` to pick a method from.
   * @param {MethodCreateOptions=} opts Configuration options
   * @return {string} Randomly picked HTTP method name.
   */
  generateMethod(isPayload, opts = {}) {
    const { chance } = this;
    if (opts.methodsPools) {
      return chance.pickone(opts.methodsPools);
    }
    if (isPayload) {
      return chance.pickone(this.payloadMethods);
    }
    return chance.pickone(this.nonPayloadMethods);
  }

  /**
   * Randomly generates a boolean flag describing if the request can
   * carry a payload.
   * @param {SavedCreateOptions=} opts Configuration options:
   * -   `noPayload` (Boolean) If set the request will not have payload
   * -   `forcePayload` (Boolean) The request will always have a payload.
   *      THe `noPayload` property takes precedence over this setting.
   * @return {boolean} `true` if the request can carry a payload and
   * `false` otherwise.
   */
  generateIsPayload(opts = {}) {
    const { chance } = this;
    let isPayload = false;
    if (!opts.noPayload) {
      if (opts.forcePayload || chance.bool()) {
        isPayload = true;
      }
    }
    return isPayload;
  }

  /**
   * Generates a `content-type` header value.
   * @return {string} Value of the `content-type` header
   */
  generateContentType() {
    return HeadersGenerator.generateContentType();
  }

  /**
   * Generates a random x-www-form-urlencoded payload.
   * @return {string} The x-www-form-urlencoded payload.
   */
  generateUrlEncodedData() {
    const { chance } = this;
    const size = chance.integer({ min: 1, max: 10 });
    let result = '';
    for (let i = 0; i < size; i++) {
      const name = encodeURIComponent(chance.word()).replace(/%20/g, '+');
      const value = encodeURIComponent(chance.paragraph()).replace(/%20/g, '+');
      if (result) {
        result += '&';
      }
      result += `${name}=${value}`;
    }
    return result;
  }

  /**
   * Generates random JSON data.
   * @return {string} JSON payload
   */
  generateJsonData() {
    const { chance } = this;
    const size = chance.integer({
      min: 1,
      max: 10,
    });
    let result = '{';
    let addComa = false;
    for (let i = 0; i < size; i++) {
      const name = chance.word();
      const value = chance.paragraph();
      if (addComa) {
        result += ',';
      } else {
        addComa = true;
      }
      result += '\n\t';
      result += `"${name}":"${value}"`;
    }
    result += '\n';
    result += '}';
    return result;
  }

  /**
   * Generates random XML data.
   * @return {string} XML payload
   */
  generateXmlData() {
    const { chance } = this;
    const size = chance.integer({ min: 1, max: 10 });
    let result = '<feed>';
    for (let i = 0; i < size; i++) {
      const name = chance.word();
      const value = chance.paragraph();
      result += '\n\t';
      result += `<${name}><![CDATA[${value}]]></${name}>`;
    }
    result += '\n';
    result += '</feed>';
    return result;
  }

  /**
   * Generates random payload data for given `contentType`.
   * The `contentType` must be one of the `contentTypes`.
   *
   * @param {string=} contentType Content type of the data.
   * @return {string} Payload message.
   */
  generatePayload(contentType) {
    if (!contentType) {
      return undefined;
    }
    const { chance } = this;
    switch (contentType) {
      case 'text/plain':
        return chance.paragraph();
      case 'application/x-www-form-urlencoded':
        return this.generateUrlEncodedData();
      case 'application/json':
        return this.generateJsonData();
      case 'application/xml':
        return this.generateXmlData();
      default:
        return '';
    }
  }

  /**
   * Generates a request timestamp that is within last month.
   * @return {number} The timestamp
   */
  generateRequestTime() {
    const { chance } = this;
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    month--;
    if (month === -1) {
      month = 11;
      year--;
    }
    const randomDay = /** @type Date */ (chance.date({ year, month }));
    return randomDay.getTime();
  }

  /**
   * Generates Google Drive item ID.
   *
   * @param {SavedCreateOptions=} opts Configuration options:
   * -   `noGoogleDrive` (Boolean) if set then it will never generate Drive ID.
   * @return {string|undefined} Google Drive ID or undefined.
   */
  generateDriveId(opts = {}) {
    if (opts.noGoogleDrive) {
      return undefined;
    }
    const { chance } = this;
    return chance.string({
      length: 32,
      pool: stringPool,
    });
  }

  /**
   * Generates a description for a request.
   *
   * @param {SavedCreateOptions=} opts Configuration options:
   * -   `noDescription` (Boolean) if set then it will never generate a desc.
   * @return {string|undefined} Items description.
   */
  generateDescription(opts) {
    const { chance } = this;
    if (opts && opts.noDescription) {
      return undefined;
    }
    return chance.bool({ likelihood: 70 }) ? chance.paragraph() : undefined;
  }

  /**
   * Generates random saved request item.
   *
   * @param {SavedCreateOptions=} opts Options to generate the request
   * @return {SavedObject} A request object
   */
  generateSavedItem(opts = {}) {
    const { chance } = this;
    const isPayload = this.generateIsPayload(opts);
    const method = this.generateMethod(isPayload, opts);
    const contentType = isPayload ? this.generateContentType() : undefined;
    const headers = this.generateHeaders(contentType, opts);
    const payload = this.generatePayload(contentType);
    const time = this.generateRequestTime();
    const requestName = chance.sentence({ words: 2 });
    const driveId = this.generateDriveId(opts);
    const description = this.generateDescription(opts);
    const midnight = this.setMidnight(time);

    const item = /** @type SavedObject */ ({
      url: chance.url(),
      method,
      headers,
      created: time,
      updated: time,
      type: 'saved',
      name: requestName,
      midnight,
    });
    if (driveId) {
      item.driveId = driveId;
    }
    if (description) {
      item.description = description;
    }
    if (payload) {
      item.payload = payload;
    }

    item._id = chance.guid({ version: 5 });
    if (opts.project) {
      item.projects = [opts.project];
    }
    return item;
  }

  /**
   * Generates a history object.
   *
   * @param {HistoryObjectOptions=} opts Options to generate the request
   * @return {HistoryObject} A request object
   */
  generateHistoryObject(opts = {}) {
    const { chance } = this;
    this.LAST_TIME -= chance.integer({ min: 1.8e6, max: 8.64e7 });
    const isPayload = this.generateIsPayload(opts);
    const method = this.generateMethod(isPayload, opts);
    const contentType = isPayload ? this.generateContentType() : undefined;
    const headers = this.generateHeaders(contentType, opts);
    const payload = this.generatePayload(contentType);
    const url = chance.url();
    const midnight = this.setMidnight(this.LAST_TIME);
    const item = {
      url,
      method,
      headers,
      created: this.LAST_TIME,
      updated: this.LAST_TIME,
      type: 'history',
      midnight,
    };
    if (payload) {
      item.payload = payload;
    }
    if (!opts.noId) {
      item._id = chance.guid({ version: 5 });
    }
    return item;
  }

  /**
   * Picks a random project from the list of passed in `opts` projects.
   *
   * @param {SavedRequestCreateOptions=} opts Configuration options:
   * -   `projects` (Array<Object>) List of generated projects
   * @return {ProjectObject|undefined} Project id or undefined.
   */
  pickProject(opts = {}) {
    const { chance } = this;
    if (!opts.projects || !opts.projects.length) {
      return undefined;
    }
    let allow;
    if (opts.forceProject) {
      allow = true;
    } else {
      allow = chance.bool();
    }
    if (allow) {
      return chance.pick(opts.projects);
    }
    return undefined;
  }

  /**
   * Generates a list of saved requests.
   *
   * @param {SavedRequestCreateOptions=} opts Configuration options
   * @return {SavedObject[]} List of requests.
   */
  generateRequests(opts = {}) {
    const list = [];
    const { requestsSize=25 } = opts;
    for (let i = 0; i < requestsSize; i++) {
      const project = this.pickProject(opts);
      const _opts = { ...opts };
      _opts.project = project && project._id;
      const item = this.generateSavedItem(_opts);
      if (project) {
        if (!project.requests) {
          project.requests = [];
        }
        project.requests.push(item._id);
      }
      list.push(item);
    }
    return list;
  }

  /**
   * Generates a list of project objects.
   *
   * @param {SavedRequestCreateOptions=} opts Configuration options
   * @return {ProjectObject[]} List of generated project objects.
   */
  generateProjects(opts = {}) {
    const { projectsSize=5 } = opts;
    const result = [];
    for (let i = 0; i < projectsSize; i++) {
      result.push(this.createProjectObject(opts));
    }
    return result;
  }

  /**
   * Generates requests data. That includes projects and requests.
   *
   * @param {SavedRequestCreateOptions=} opts Configuration options
   * @return {GenerateSavedResult} A map with `projects` and `requests` arrays.
   */
  generateSavedRequestData(opts = {}) {
    const projects = this.generateProjects(opts);
    const copy = { ...opts };
    copy.projects = projects;
    const requests = this.generateRequests(copy);
    return {
      requests,
      projects,
    };
  }

  /**
   * Generates history requests list
   *
   * @param {HistoryObjectOptions} opts Configuration options:
   * -   `requestsSize` (Number) Number of request to generate. Default to 25.
   * Rest of configuration options are defined in
   * `generateHistoryObject`
   * @return {HistoryObject[]} List of history requests objects
   */
  generateHistoryRequestsData(opts = {}) {
    const { requestsSize=25 } = opts;
    const result = [];
    for (let i = 0; i < requestsSize; i++) {
      result.push(this.generateHistoryObject(opts));
    }
    return result;
  }

  /**
   * Generates a random data for a variable object
   * @param {VariablesCreateOptions=} opts
   * - {Boolean} defaultEnv When set it always set environment to "default"
   * @return {VariableObject} A variable object.
   */
  generateVariableObject(opts = {}) {
    const { chance } = this;
    let isDefault;
    if (opts.defaultEnv) {
      isDefault = true;
    } else if (opts.randomEnv) {
      isDefault = false;
    } else {
      isDefault = chance.bool();
    }
    
    const result = /** @type VariableObject */ ({
      enabled: chance.bool({ likelihood: 85 }),
      value: chance.sentence({ words: 2 }),
      name: chance.word(),
      _id: chance.guid({ version: 5 }),
      environment: '',
    });
    if (isDefault) {
      result.environment = 'default';
    } else {
      result.environment = chance.sentence({ words: 2 });
    }
    return result;
  }

  /**
   * Generates variables list
   *
   * @param {VariablesCreateOptions=} opts Configuration options:
   * -   `size` (Number) Number of variables to generate. Default to 25.
   * @return {VariableObject[]} List of variables
   */
  generateVariablesData(opts = {}) {
    const size = opts.size || 25;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.generateVariableObject(opts));
    }
    return result;
  }

  /**
   * Generates random Cookie data
   * @returns {CookieObject}
   */
  generateCookieObject() {
    const { chance } = this;
    const time = chance.hammertime();
    const result = {
      created: time,
      updated: time,
      expires: chance.hammertime(),
      maxAge: chance.integer({ min: 100, max: 1000 }),
      name: chance.word(),
      value: chance.word(),
      _id: chance.guid({ version: 5 }),
      domain: chance.domain(),
      hostOnly: chance.bool(),
      httpOnly: chance.bool(),
      lastAccess: time,
      path: chance.bool() ? '/' : `/${chance.word()}`,
      persistent: chance.bool(),
    };
    return result;
  }

  /**
   * Generates cookies list
   *
   * @param {CookieCreateOptions=} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {CookieObject[]} List of datastore entries.
   */
  generateCookiesData(opts = {}) {
    const size = opts.size || 25;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.generateCookieObject());
    }
    return result;
  }

  /**
   * Generates random URL data object
   * @return {UrlObject}
   */
  generateUrlObject() {
    const { chance } = this;
    const url = chance.url();
    const time = chance.hammertime();
    const result = /** @type UrlObject */ ({
      time,
      cnt: chance.integer({ min: 100, max: 1000 }),
      _id: chance.url(),
      url,
      midnight: this.setMidnight(time),
    });
    return result;
  }

  /**
   * Generates urls list
   *
   * @param {SizeCreateOptions=} opts Configuration options
   * @return {UrlObject[]} List of datastore entries.
   */
  generateUrlsData(opts = {}) {
    const size = opts.size || 25;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.generateUrlObject());
    }
    return result;
  }

  /**
   * Generates random URL data object.
   * @return {HostRuleObject}
   */
  generateHostRuleObject() {
    const { chance } = this;
    const result = {
      _id: chance.guid({ version: 5 }),
      from: chance.url(),
      to: chance.url(),
      enabled: chance.bool(),
      comment: chance.string(),
    };
    return result;
  }

  /**
   * Generates host rules
   *
   * @param {SizeCreateOptions=} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {HostRuleObject[]} List of datastore entries.
   */
  generateHostRulesData(opts = {}) {
    const copy = { ...opts };
    copy.size = copy.size || 25;
    const result = [];
    for (let i = 0; i < copy.size; i++) {
      result.push(this.generateHostRuleObject());
    }
    return result;
  }

  /**
   * Generates random Basic authorization object.
   * @return {BasicAuthObject}
   */
  generateBasicAuthObject() {
    const { chance } = this;
    const result = {
      _id: `basic/${chance.string()}`,
      type: 'basic',
      url: chance.url(),
    };
    return result;
  }

  /**
   * Generates basic authorization data
   *
   * @param {SizeCreateOptions=} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {BasicAuthObject[]} List of datastore entries.
   */
  generateBasicAuthData(opts = {}) {
    const copy = { ...opts };
    copy.size = copy.size || 25;
    const result = [];
    for (let i = 0; i < copy.size; i++) {
      result.push(this.generateBasicAuthObject());
    }
    return result;
  }

  /**
   * @param {ApiIndexListCreateOptions=} opts
   * @returns {ApiIndexObject}
   */
  generateApiIndex(opts = {}) {
    const { chance } = this;
    const result = {};
    const versionsSize = opts.versionSize
      ? opts.versionSize
      : chance.integer({ min: 1, max: 5 });
    const versions = [];
    let last;
    for (let i = 0; i < versionsSize; i++) {
      last = `v${i}`;
      versions[versions.length] = last;
    }
    result.order = opts.order || 0;
    result.title = chance.sentence({ words: 2 });
    result.type = 'RAML 1.0';
    result._id = chance.url();
    result.versions = versions;
    result.latest = last;
    return result;
  }

  /**
   * @param {ApiIndexListCreateOptions=} opts
   * @returns {ApiIndexObject[]}
   */
  generateApiIndexList(opts={}) {
    const copy = { ...opts };
    copy.size = copy.size || 25;
    const result = [];
    for (let i = 0; i < copy.size; i++) {
      result.push(this.generateApiIndex({ ...copy, order: i }));
    }
    return result;
  }

  /**
   * @param {ApiIndexObject} index
   * @returns {ApiDataObject[]}
   */
  generateApiData(index) {
    const result = [];
    index.versions.forEach((version) => {
      const item = {
        data: '[{}]',
        indexId: index._id,
        version,
        _id: `${index._id}|${version}`,
      };
      result[result.length] = item;
    });
    return result;
  }

  /**
   * @param {ApiIndexObject[]} indexes
   * @returns {ApiDataObject[]}
   */
  generateApiDataList(indexes) {
    const size = indexes.length;
    let result = [];
    for (let i = 0; i < size; i++) {
      const data = this.generateApiData(indexes[i]);
      result = result.concat(data);
    }
    return result;
  }

  /**
   * Transforms ASCII string to buffer.
   * @param {string} asciiString
   * @return {Uint8Array}
   */
  strToBuffer(asciiString) {
    return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)));
  }

  /**
   * Converts incoming data to base64 string.
   * @param {ArrayBuffer|Buffer} ab
   * @return {string} Safe to store string.
   */
  bufferToBase64(ab) {
    // @ts-ignore
    return btoa(String.fromCharCode(...ab));
  }

  /**
   * Converts base64 string to Uint8Array.
   * @param {string} str
   * @return {Uint8Array} Restored array view.
   */
  base64ToBuffer(str) {
    const asciiString = atob(str);
    return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)));
  }

  /**
   * Creates a certificate struct.
   * @param {CertificateCreateOptions=} opts
   * - binary {Boolean}
   * - noPassphrase {Boolean}
   * @return {ArcCertificateDataObject}
   */
  generateCertificate(opts = {}) {
    const { chance } = this;
    const data = chance.paragraph();
    const result = /** @type ArcCertificateDataObject */ ({
      data,
    });
    if (opts.binary) {
      result.data = this.strToBuffer(data);
    }
    if (!opts.noPassphrase) {
      result.passphrase = chance.word();
    }
    return result;
  }

  /**
   * Creates a clientCertificate struct.
   * @param {CertificateCreateOptions=} opts Create options
   * @return {ArcCertificateObject}
   */
  generateClientCertificate(opts = {}) {
    const { chance } = this;
    const type = opts.type ? opts.type : chance.pick(['p12', 'pem']);
    const cert = this.generateCertificate(opts);
    const name = chance.word();
    const result = {
      type,
      name,
      cert,
    };
    if (!opts.noKey) {
      result.key = this.generateCertificate(opts);
    }
    if (!opts.noCreated) {
      result.created = Date.now();
    }
    return result;
  }

  /**
   * Creates a list of ClientCertificate struct.
   * @param {CertificateCreateOptions=} opts Create options
   * @return {ArcCertificateObject[]}
   */
  generateClientCertificates(opts = {}) {
    const size = opts.size || 15;
    const result = [];
    for (let i = 0; i < size; i++) {
      result[result.length] = this.generateClientCertificate(opts);
    }
    return result;
  }

  /**
   * Creates a ClientCertificate transformed to the export object.
   * 
   * @param {CertificateCreateOptions=} opts
   * @return {ArcExportCertificateObject}
   */
  generateExportClientCertificate(opts = {}) {
    const { chance } = this;
    const item = /** @type any */ (this.generateClientCertificate(opts));
    if (item.key) {
      item.pKey = item.key;
    }
    item.key = chance.guid({ version: 5 });
    item.kind = 'ARC#ClientCertificate';
    return item;
  }
  
  /**
   * Creates a list of ClientCertificates transformed for the export object.
   * 
   * @param {CertificateCreateOptions=} opts
   * @return {ArcExportCertificateObject[]}
   */
  generateExportClientCertificates(opts = {}) {
    const size = opts.size || 15;
    const result = [];
    for (let i = 0; i < size; i++) {
      result[result.length] = this.generateExportClientCertificate(opts);
    }
    return result;
  }

  /**
   * Generates HAR timings object
   * @param {HarTimingsOptions} [opts={}] Generate data options
   * @returns {RequestTime}
   */
  generateHarTimings(opts = {}) {
    const { chance } = this;
    const result = /** @type RequestTime */ ({
      blocked: chance.integer({ min: 0, max: 100 }),
      connect: chance.integer({ min: 0, max: 100 }),
      receive: chance.integer({ min: 0, max: 100 }),
      send: chance.integer({ min: 0, max: 100 }),
      wait: chance.integer({ min: 0, max: 100 }),
      dns: chance.integer({ min: 0, max: 100 }),
    });
    if (opts.ssl) {
      result.ssl = chance.integer({ min: 0, max: 100 });
    }
    return result;
  }

  /**
   * @param {RedirectStatusOptions=} [opts={}] Generate data options
   * @returns {RedirectStatusObject}
   */
  generateRedirectStatus(opts = {}) {
    const code = typeof opts.code === 'number' ? opts.code : this.chance.pickone(this.redirectCodes);
    const messages = {
      301: 'Moved Permanently',
      302: 'Found',
      303: 'See Other',
      307: 'Temporary Redirect',
      308: 'Permanent Redirect',
    };
    const status = opts.status ? opts.status : messages[code];
    return {
      code,
      status,
    }
  }

  /**
   * Generates ARC redirect response object
   * @param {ResponseRedirectOptions=} [opts={}] Generate data options
   * @returns {ResponseRedirect}
   */
  generateRedirectResponse(opts={}) {
    const ct = opts.body ? this.generateContentType() : undefined;
    let headers = this.generateHeaders(ct);
    const url = HeadersGenerator.generateLink();
    headers += `\nlocation: ${url}`;
    const { code, status } = this.generateRedirectStatus(opts);
    const body = opts.body ? this.generatePayload(ct) : undefined;
    const startTime = this.chance.hammertime();
    const length = this.chance.integer({ min: 10, max: 4000 });
    const result = /** @type ResponseRedirect */({
      response: {
        status: code,
        statusText: status,
        headers,
        payload: body,
      },
      startTime,
      endTime: startTime + length,
    });
    if (opts.timings) {
      result.timings = this.generateHarTimings(opts);
    }
    return result;
  }

  /**
   * Generates a response object.
   * @param {ResponseOptions=} [opts={}] Generate options
   * @returns {Response} The response object
   */
  generateResponse(opts={}) {
    const ct = opts.noBody ? undefined : this.generateContentType();
    const body = opts.noBody ? undefined : this.generatePayload(ct);
    const headers = HeadersGenerator.generateHeaders('response', ct);
    const statusGroup = opts.statusGroup ? opts.statusGroup : this.chance.integer({ min: 2, max: 5 });
    const sCode = this.chance.integer({ min: 0, max: 99 }).toString();
    const code = Number(`${statusGroup}${sCode.padStart(2, '0')}`);
    const status = this.chance.word();
    const length = this.chance.integer({ min: 10, max: 4000 });
    const result = /** @type Response */({
      status: code,
      statusText: status,
      headers,
      loadingTime: length,
    });
    if (opts.timings) {
      result.timings = this.generateHarTimings(opts);
    }
    if (!opts.noBody) {
      result.payload = body;
    }
    if (!opts.noSize) {
      const hSize = headers.length;
      const bSize = body ? body.length : 0;
      result.size = {
        request: this.chance.integer({ min: 10 }),
        response: hSize + bSize,
      };
    }
    if (opts.redirects) {
      const size = this.chance.integer({ min: 1, max: 4 });
      const cnf = { timing: true, body: true };
      result.redirects = new Array(size).fill(0).map(() => this.generateRedirectResponse(cnf));
    }
    return result;
  }

  /**
   * @returns {ErrorResponse}
   */
  generateErrorResponse() {
    const error = new Error(this.chance.paragraph());
    const result = /** @type ErrorResponse */({
      status: 0,
      error,
    });
    return result;
  }

  /**
   * Preforms `insertSavedRequestData` if no requests data are in
   * the data store.
   * @param {SavedRequestCreateOptions=} opts Configuration options
   * @return {Promise<InsertSavedResult>} Resolved promise when data are inserted into the datastore.
   */
  async insertSavedIfNotExists(opts = {}) {
    const savedDb = new PouchDB('saved-requests');
    const response = await savedDb.allDocs({
      include_docs: true,
    });
    if (!response.rows.length) {
      return this.insertSavedRequestData(opts);
    }
    const result = {
      requests: response.rows.map((item) => {
        return item.doc;
      }),
      projects: [],
    };
    const projectsDb = new PouchDB('legacy-projects');
    const projectsResponse = await projectsDb.allDocs({
      include_docs: true,
    });
    result.projects = projectsResponse.rows.map((item) => {
      return item.doc;
    });
    return result;
  }

  /**
   * Preforms `insertHistoryRequestData` if no requests data are in
   * the data store.
   * @param {HistoryObjectOptions=} opts See `insertHistoryRequestData`
   * for description.
   * @return {Promise<PouchDB.Core.ExistingDocument<HistoryObject>[]>} Resolved promise when data are inserted into the datastore.
   */
  async insertHistoryIfNotExists(opts = {}) {
    const db = new PouchDB('history-requests');
    const response = await db.allDocs({
      include_docs: true,
    });
    if (!response.rows.length) {
      return this.insertHistoryRequestData(opts);
    }
    return response.rows.map((item) => item.doc);
  }

  /**
   * Creates `_id` on the original insert object if it wasn't created before and
   * updates `_rev` property.
   * 
   * @template T
   * @param {(PouchDB.Core.Response|PouchDB.Core.Error)[]} insertResponse PouchDB build insert response
   * @param {T[]} insertedData The original array of inserted objects.
   * This changes contents of te array items which is passed by reference.
   * @return {PouchDB.Core.ExistingDocument<T>[]}
   */
  updateRevsAndIds(insertResponse, insertedData) {
    const result = [];
    insertResponse.forEach((item, i) => {
      const error = /** @type PouchDB.Core.Error */ (item);
      if (error.error) {
        return;
      }
      const copy = /** @type any */ ({ ...insertedData[i] });
      if (!copy._id) {
        copy._id = item.id;
      }
      copy._rev = item.rev;
      result.push(copy);
    });
    return result;
  }

  /**
   * Generates saved requests data and inserts them into the data store if they
   * are missing.
   *
   * @param {SavedRequestCreateOptions=} opts See `generateSavedRequestData`
   * for description.
   * @return {Promise<InsertSavedResult>} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertSavedRequestData(opts = {}) {
    const data = this.generateSavedRequestData(opts);
    const result = /** @type InsertSavedResult */ ({
      projects: [],
      requests: [],
    });
    const projectsDb = new PouchDB('legacy-projects');
    const response = await projectsDb.bulkDocs(data.projects);
    result.projects = this.updateRevsAndIds(response, data.projects);
    const savedDb = new PouchDB('saved-requests');
    const response2 = await savedDb.bulkDocs(data.requests);
    result.requests = this.updateRevsAndIds(response2, data.requests);
    return result;
  }

  /**
   * Generates and saves history data to the data store.
   *
   * @param {HistoryObjectOptions=} opts See `generateHistoryRequestsData`
   * for description.
   * @return {Promise<PouchDB.Core.ExistingDocument<HistoryObject>[]>} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertHistoryRequestData(opts = {}) {
    const data = this.generateHistoryRequestsData(opts);
    const db = new PouchDB('history-requests');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * Generates and saves a list of project objects.
   *
   * @param {SavedRequestCreateOptions=} opts Configuration options:
   * - `projectsSize` (Number) A number of projects to generate.
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   * @return {Promise<PouchDB.Core.ExistingDocument<ProjectObject>[]>}
   */
  async insertProjectsData(opts = {}) {
    const data = this.generateProjects(opts);
    const db = new PouchDB('legacy-projects');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * Generates and saves websocket data to the data store.
   *
   * @param {SizeCreateOptions=} opts Create options
   * @return {Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>} 
   */
  async insertWebsocketData(opts = {}) {
    const data = this.generateUrlsData(opts);
    const db = new PouchDB('websocket-url-history');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * Generates and saves url history data to the data store.
   *
   * @param {SizeCreateOptions=} opts Create options
   * @return {Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>}
   */
  async insertUrlHistoryData(opts = {}) {
    const data = this.generateUrlsData(opts);
    const db = new PouchDB('url-history');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * Generates and saves variables data to the data store.
   *
   * @param {VariablesCreateOptions=} opts Create options
   * @return {Promise<PouchDB.Core.ExistingDocument<VariableObject>[]>} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertVariablesData(opts = {}) {
    const data = this.generateVariablesData(opts);
    const db = new PouchDB('variables');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * Generates and saves cookies data to the data store.
   *
   * @param {CookieCreateOptions=} opts Create options
   * @return {Promise<PouchDB.Core.ExistingDocument<CookieObject>[]>} 
   */
  async insertCookiesData(opts = {}) {
    const data = this.generateCookiesData(opts);
    const db = new PouchDB('cookies');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * Generates and saves basic auth data to the data store.
   *
   * @param {SizeCreateOptions=} opts Create options
   * @return {Promise<PouchDB.Core.ExistingDocument<BasicAuthObject>[]>} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertBasicAuthData(opts = {}) {
    const data = this.generateBasicAuthData(opts);
    const db = new PouchDB('auth-data');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * Generates and saves host rules data to the data store.
   *
   * @param {SizeCreateOptions=} opts Create options
   * @return {Promise<PouchDB.Core.ExistingDocument<HostRuleObject>[]>} 
   */
  async insertHostRulesData(opts = {}) {
    const data = this.generateHostRulesData(opts);
    const db = new PouchDB('host-rules');
    const response = await db.bulkDocs(data);
    return this.updateRevsAndIds(response, data);
  }

  /**
   * 
   * @param {ApiIndexListCreateOptions=} opts 
   * @return {Promise<(PouchDB.Core.ExistingDocument<any>)[]>}
   */
  async insertApiData(opts = {}) {
    let index = this.generateApiIndexList(opts);
    let data = this.generateApiDataList(index);
    const indexDb = new PouchDB('api-index');
    const indexResponse = await indexDb.bulkDocs(index);
    index = this.updateRevsAndIds(indexResponse, index);
    const dataDb = new PouchDB('api-data');
    const dataResponse = await dataDb.bulkDocs(data);
    data = this.updateRevsAndIds(dataResponse, data);
    return [index, data];
  }

  /**
   * @param {ArcCertificateDataObject} cert 
   * @returns {ArcCertificateDataObject}
   */
  certificateToStore(cert) {
    if (typeof cert.data === 'string') {
      return cert;
    }
    const data = this.bufferToBase64(cert.data);
    const copy = { ...cert, type: 'buffer', data };
    return copy;
  }

  /**
   * @param {CertificateCreateOptions=} opts 
   * @returns {Promise<PouchDB.Core.ExistingDocument<ArcCertificateObject>[]>}
   */
  async insertCertificatesData(opts = {}) {
    const data = this.generateClientCertificates(opts);
    const responses = [];
    const indexDb = new PouchDB('client-certificates');
    const dataDb = new PouchDB('client-certificates-data');
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const dataDoc = {
        cert: this.certificateToStore(/** @type ArcCertificateDataObject */ (item.cert)),
      };
      delete item.cert;
      if (item.key) {
        dataDoc.key = this.certificateToStore(/** @type ArcCertificateDataObject */ (item.key));
        delete item.key;
      }
      /* eslint-disable-next-line no-await-in-loop */
      const dataRes = await dataDb.post(dataDoc);
      // @ts-ignore
      item._id = dataRes.id;
      /* eslint-disable-next-line no-await-in-loop */
      responses[responses.length] = await indexDb.post(item);
    }
    return this.updateRevsAndIds(responses, data);
  }

  /**
   * Destroys saved and projects database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroySavedRequestData() {
    const savedDb = new PouchDB('saved-requests');
    const projectsDb = new PouchDB('legacy-projects');
    await savedDb.destroy();
    await projectsDb.destroy();
  }

  /**
   * Destroys history database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyHistoryData() {
    const db = new PouchDB('history-requests');
    await db.destroy();
  }

  /**
   * Destroys legacy projects database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async clearLegacyProjects() {
    const db = new PouchDB('legacy-projects');
    await db.destroy();
  }

  /**
   * Destroys websockets URL history database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyWebsocketsData() {
    const db = new PouchDB('websocket-url-history');
    await db.destroy();
  }

  /**
   * Destroys URL history database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyUrlData() {
    const db = new PouchDB('url-history');
    await db.destroy();
  }

  /**
   * Destroys variables and environments database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyVariablesData() {
    const db = new PouchDB('variables');
    const db2 = new PouchDB('variables-environments');
    await db.destroy();
    await db2.destroy();
  }

  /**
   * Destroys cookies database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyCookiesData() {
    const db = new PouchDB('cookies');
    await db.destroy();
  }

  /**
   * Destroys auth data database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyAuthData() {
    const db = new PouchDB('auth-data');
    await db.destroy();
  }

  /**
   * Destroys hosts data database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyHostRulesData() {
    const db = new PouchDB('host-rules');
    await db.destroy();
  }

  /**
   * Destroys api-index data database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyApiIndexData() {
    const db = new PouchDB('api-index');
    await db.destroy();
  }

  /**
   * Destroys api-data database.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyApiData() {
    const db = new PouchDB('api-data');
    await db.destroy();
  }

  /**
   * @return {Promise<void>} 
   */
  async destroyAllApiData() {
    await this.destroyApiIndexData();
    await this.destroyApiData();
  }

  /**
   * @return {Promise<void>} 
   */
  async destroyClientCertificates() {
    await new PouchDB('client-certificates').destroy();
    await new PouchDB('client-certificates-data').destroy();
  }

  /**
   * Destroys all databases.
   * @return {Promise<void>} Resolved promise when the data are cleared.
   */
  async destroyAll() {
    await this.destroySavedRequestData();
    await this.destroyHistoryData();
    await this.destroyWebsocketsData();
    await this.destroyUrlData();
    await this.destroyVariablesData();
    await this.destroyCookiesData();
    await this.destroyAuthData();
    await this.destroyHostRulesData();
    await this.destroyApiIndexData();
    await this.destroyApiData();
    await this.destroyClientCertificates();
  }

  /**
   * Deeply clones an object.
   * @param {any[]|Date|object} obj Object to be cloned
   * @return {any[]|Date|object} Copied object
   */
  clone(obj) {
    let copy;
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.clone(obj[i]);
      }
      return copy;
    }
    if (obj instanceof Object) {
      copy = {};
      Object.keys(obj).forEach((key) => {
        copy[key] = this.clone(obj[key]);
      });
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  /**
   * Reads all data from a data store.
   * @param {string} name Name of the data store to read from. Without
   * `_pouch_` prefix
   * @return {Promise<any[]>} Promise resolved to all read docs.
   */
  async getDatastoreData(name) {
    const db = new PouchDB(name);
    const response = await db.allDocs({
      include_docs: true,
    });
    return response.rows.map((item) => item.doc);
  }

  /**
   * Returns a promise with all saved requests
   * @return {Promise<PouchDB.Core.ExistingDocument<SavedObject>[]>}
   */
  async getDatastoreRequestData() {
    return this.getDatastoreData('saved-requests');
  }

  /**
   * Returns a promise with all legacy projects
   * @return {Promise<PouchDB.Core.ExistingDocument<ProjectObject>[]>}
   */
  async getDatastoreProjectsData() {
    return this.getDatastoreData('legacy-projects');
  }

  /**
   * Returns a promise with all history requests
   * @return {Promise<PouchDB.Core.ExistingDocument<HistoryObject>[]>}
   */
  async getDatastoreHistoryData() {
    return this.getDatastoreData('history-requests');
  }

  /**
   * Returns a promise with all variables
   * @return {Promise<PouchDB.Core.ExistingDocument<VariableObject>[]>}
   */
  async getDatastoreVariablesData() {
    return this.getDatastoreData('variables');
  }

  // Returns a promise with all environments
  async getDatastoreEnvironmentsData() {
    return this.getDatastoreData('variables-environments');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<CookieObject>[]>}
   */
  async getDatastoreCookiesData() {
    return this.getDatastoreData('cookies');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>}
   */
  async getDatastoreWebsocketsData() {
    return this.getDatastoreData('websocket-url-history');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>}
   */
  async getDatastoreUrlsData() {
    return this.getDatastoreData('url-history');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<BasicAuthObject>[]>}
   */
  async getDatastoreAuthData() {
    return this.getDatastoreData('auth-data');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<HostRuleObject>[]>}
   */
  async getDatastoreHostRulesData() {
    return this.getDatastoreData('host-rules');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<ApiIndexObject>[]>}
   */
  async getDatastoreApiIndexData() {
    return this.getDatastoreData('api-index');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<ApiDataObject>[]>}
   */
  async getDatastoreHostApiData() {
    return this.getDatastoreData('api-data');
  }

  /**
   * @return {Promise<PouchDB.Core.ExistingDocument<(ArcCertificateIndexObject|ArcCertificateIndexDataObject)>[][]>}
   */
  async getDatastoreClientCertificates() {
    const certs = await this.getDatastoreData('client-certificates');
    const data = await this.getDatastoreData('client-certificates-data');
    return [certs, data];
  }

  /**
   * Updates an object in an data store.
   *
   * @param {string} dbName Name of the data store.
   * @param {object} obj The object to be stored.
   * @return {Promise<PouchDB.Core.Response>} A promise resolved to insert result.
   */
  async updateObject(dbName, obj) {
    const db = new PouchDB(dbName);
    return db.put(obj, {
      force: true,
    });
  }
}
