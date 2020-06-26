import 'pouchdb/dist/pouchdb.js';
import 'chance/dist/chance.min.js';

/** @typedef {import('./DataGenerator').ProjectCreateOptions} ProjectCreateOptions */
/** @typedef {import('./DataGenerator').HeaderCreateOptions} HeaderCreateOptions */
/** @typedef {import('./DataGenerator').MethodCreateOptions} MethodCreateOptions */
/** @typedef {import('./DataGenerator').SavedCreateOptions} SavedCreateOptions */
/** @typedef {import('./DataGenerator').HistoryObjectOptions} HistoryObjectOptions */

/* global Chance, PouchDB */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

// @ts-ignore
const chance = new Chance();

const stringPool =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export class DataGenerator {
  get payloadMethods() {
    return ['POST', 'PUT', 'DELETE', 'OPTIONS'];
  }

  get nonPayloadMethods() {
    return ['GET', 'HEAD'];
  }

  get contentTypes() {
    return [
      'application/x-www-form-urlencoded',
      'application/json',
      'application/xml',
      'text/plain',
    ];
  }

  constructor() {
    this.LAST_TIME = Date.now();
  }

  /**
   * Sets a midnight on the timestamp
   * @param {number} time
   */
  setMidninght(time) {
    const now = new Date(time);
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);
    now.setHours(0);
    return now.getTime();
  }

  /**
   * Generates a random ARC legacy project object.
   *
   * @param {ProjectCreateOptions=} opts Create options:
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   * @return {object} ARC's object.
   */
  createProjectObject(opts = {}) {
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
    if (opts.methodsPools) {
      return chance.pick(opts.methodsPools);
    }
    if (isPayload) {
      return chance.pick(this.payloadMethods);
    }
    return chance.pick(this.nonPayloadMethods);
  }

  /**
   * Randomly generates a boolean flag describing if the request can
   * carry a payload.
   * @param {object=} opts Configuration options:
   * -   `noPayload` (Boolean) If set the request will not have payload
   * -   `forcePayload` (Boolean) The request will always have a payload.
   *      THe `noPayload` property takes precedence over this setting.
   * @return {boolean} `true` if the request can carry a payload and
   * `false` otherwise.
   */
  generateIsPayload(opts = {}) {
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
    return chance.pick(this.contentTypes);
  }

  /**
   * Generates a random x-www-form-urlencoded payload.
   * @return {string} The x-www-form-urlencoded payload.
   */
  generateUrlEncodedData() {
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
   * @param {string} contentType Content type of the data.
   * @return {string} Payload message.
   */
  generatePayload(contentType) {
    if (!contentType) {
      return undefined;
    }
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
        throw new Error('Unknown payload.');
    }
  }

  /**
   * Generates a request timestamp that is within last month.
   * @return {number} The timestamp
   */
  generateRequestTime() {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    month--;
    if (month === -1) {
      month = 11;
      year--;
    }
    const randomDay = chance.date({ year, month });
    return randomDay.getTime();
  }

  /**
   * Generates Google Drive item ID.
   *
   * @param {object} opts Configuration options:
   * -   `noGoogleDrive` (Boolean) if set then it will never generate Drive ID.
   * @return {string|undefined} Google Drive ID or undefined.
   */
  generateDriveId(opts = {}) {
    if (opts.noGoogleDrive) {
      return undefined;
    }
    return chance.string({
      length: 32,
      pool: stringPool,
    });
  }

  /**
   * Generates a description for a request.
   *
   * @param {object} opts Configuration options:
   * -   `noDescription` (Boolean) if set then it will never generate a desc.
   * @return {String|undefined} Items description.
   */
  generateDescription(opts) {
    if (opts && opts.noDescription) {
      return undefined;
    }
    return chance.bool({ likelihood: 70 }) ? chance.paragraph() : undefined;
  }

  /**
   * Generates random saved request item.
   *
   * @param {SavedCreateOptions=} opts Options to generate the request
   * @return {object} A request object
   */
  generateSavedItem(opts = {}) {
    const isPayload = this.generateIsPayload(opts);
    const method = this.generateMethod(isPayload, opts);
    const contentType = isPayload ? this.generateContentType() : undefined;
    const headers = this.generateHeaders(contentType, opts);
    const payload = this.generatePayload(contentType);
    const time = this.generateRequestTime();
    const requestName = chance.sentence({ words: 2 });
    const driveId = this.generateDriveId(opts);
    const description = this.generateDescription(opts);

    const item = {
      url: chance.url(),
      method,
      headers,
      created: time,
      updated: time,
      type: 'saved',
      name: requestName,
    };
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
   * @return {object} A request object
   */
  generateHistoryObject(opts = {}) {
    this.LAST_TIME -= chance.integer({ min: 1.8e6, max: 8.64e7 });
    const isPayload = this.generateIsPayload(opts);
    const method = this.generateMethod(isPayload, opts);
    const contentType = isPayload ? this.generateContentType() : undefined;
    const headers = this.generateHeaders(contentType, opts);
    const payload = this.generatePayload(contentType);
    const url = chance.url();
    const item = {
      url,
      method,
      headers,
      created: this.LAST_TIME,
      updated: this.LAST_TIME,
      type: 'history',
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
   * @param {object} opts Configuration options:
   * -   `projects` (Array<Object>) List of generated projects
   * @return {object|undefined} Project id or undefined.
   */
  pickProject(opts = {}) {
    if (!opts.projects) {
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
   * @param {object} opts Configuration options:
   * -   `projects` (Array<Object>) List of generated projects
   * -   `requestsSize` (Number) Number of request to generate. Default to 25.
   * Rest of configuration options are defined in
   * `generateSavedItem()`
   * @return {Array<Object>} List of requests.
   */
  generateRequests(opts = {}) {
    const list = [];
    const size = opts.requestsSize || 25;
    for (let i = 0; i < size; i++) {
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
   * @param {object} opts Configuration options:
   * - `projectsSize` (Number) A number of projects to generate.
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   * @return {Array<Object>} List of generated project objects.
   */
  generateProjects(opts = {}) {
    const size = opts.projectsSize || 5;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.createProjectObject(opts));
    }
    return result;
  }

  /**
   * Generates requests data. That includes projects and requests.
   *
   * @param {object} opts Configuration options:
   * -   `projectsSize` (Number) A number of projects to generate.
   * -   `requestsSize` (Number) Number of request to generate. Default to 25.
   * Rest of configuration options are defined in
   * `generateSavedItem`
   * @return {object} A map with `projects` and `requests` arrays.
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
   * @param {object} opts Configuration options:
   * -   `requestsSize` (Number) Number of request to generate. Default to 25.
   * Rest of configuration options are defined in
   * `generateHistoryObject`
   * @return {object[]} List of history requests objects
   */
  generateHistoryRequestsData(opts = {}) {
    const size = opts.requestsSize || 25;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.generateHistoryObject(opts));
    }
    return result;
  }

  /**
   * Generates a random data for a variable object
   * @param {object=} opts
   * - {Boolean} defaultEnv When set it always set environment to "default"
   * @return {object} A variable object.
   */
  generateVariableObject(opts = {}) {
    let isDefault;
    if (opts.defaultEnv) {
      isDefault = true;
    } else if (opts.randomEnv) {
      isDefault = false;
    } else {
      isDefault = chance.bool();
    }
    const result = {
      enabled: chance.bool({ likelihood: 85 }),
      value: chance.sentence({ words: 2 }),
      variable: chance.word(),
      _id: chance.guid({ version: 5 }),
    };
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
   * @param {object=} opts Configuration options:
   * -   `size` (Number) Number of variables to generate. Default to 25.
   * @return {object[]} List of variables
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
   * Generate a header set datastore entry
   *
   * @param {object} opts Generation options:
   * -   `noHeaders` (Boolean) will not generate headers string (will set empty
   *      string)
   * -   `noPayload` (Boolean) If set the request will not have payload
   * -   `forcePayload` (Boolean) The request will always have a payload.
   *      THe `noPayload` property takes precedence over this setting.
   * @return {object}
   */
  generateHeaderSetObject(opts) {
    const time = chance.hammertime();

    const isPayload = this.generateIsPayload(opts);
    const contentType = isPayload ? this.generateContentType() : undefined;
    const headers = this.generateHeaders(contentType, opts);

    const result = {
      created: time,
      updated: time,
      order: chance.integer({ min: 0, max: 10 }),
      name: chance.sentence({ words: 2 }),
      headers,
      _id: chance.guid({ version: 5 }),
    };
    return result;
  }

  /**
   * Generates headers sets list
   *
   * @param {object=} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {object[]} List of datastore entries.
   */
  generateHeadersSetsData(opts = {}) {
    const size = opts.size || 25;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.generateHeaderSetObject(opts));
    }
    return result;
  }

  // Generates random Cookie data
  generateCookieObject() {
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
   * @param {object=} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {object[]} List of datastore entries.
   */
  generateCookiesData(opts = {}) {
    const size = opts.size || 25;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.generateCookieObject());
    }
    return result;
  }

  // Generates random URL data object
  generateUrlObject() {
    const result = {
      time: chance.hammertime(),
      cnt: chance.integer({ min: 100, max: 1000 }),
      _id: chance.url(),
    };
    return result;
  }

  /**
   * Generates urls list
   *
   * @param {object} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {object[]} List of datastore entries.
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
   * @return {object}
   */
  generateHostRuleObject() {
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
   * @param {object} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {object[]} List of datastore entries.
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
   * @return {object}
   */
  generateBasicAuthObject() {
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
   * @param {object=} opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @return {object[]} List of datastore entries.
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

  generateApiIndex(opts = {}) {
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

  generateApiIndexList(opts) {
    const copy = { ...opts };
    copy.size = copy.size || 25;
    const result = [];
    for (let i = 0; i < copy.size; i++) {
      result.push(
        this.generateApiIndex({
          order: i,
        })
      );
    }
    return result;
  }

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
   * Converts incomming data to base64 string.
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
   * @param {object=} opts
   * - binary {Boolean}
   * - noPassphrase {Boolean}
   * @return {object}
   */
  generateCertificate(opts = {}) {
    let data = chance.paragraph();
    if (opts.binary) {
      data = this.strToBuffer(data);
    }
    const result = {
      data,
    };
    if (!opts.noPassphrase) {
      result.passphrase = chance.word();
    }
    return result;
  }

  /**
   * Creates a clientCertificate struct.
   * @param {object=} opts
   * - binary {Boolean}
   * - noPassphrase {Boolean}
   * - type {string} - `p12` or `pem`
   * - noKey {Boolean}
   * - noCreated {Boolean}
   * @return {object}
   */
  generateClientCertificate(opts = {}) {
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
   * @param {object=} opts
   * - size {number} - default 15
   * - binary {Boolean}
   * - noPassphrase {Boolean}
   * - type {string} - `p12` or `pem`
   * - noKey {Boolean}
   * - noCreated {Boolean}
   * @return {object[]}
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
   * Preforms `insertSavedRequestData` if no requests data are in
   * the data store.
   * @param {object} opts See `generateSavedRequestData`
   * for description.
   * @return {Promise<object>} Resolved promise when data are inserted into the datastore.
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
   * @param {object} opts See `insertHistoryRequestData`
   * for description.
   * @return {Promise<object[]>} Resolved promise when data are inserted into the datastore.
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
   * @param {Array<Object>} insertResponse PouchDB build insert response
   * @param {Array<Object>} insertedData The original array of inserted objects.
   * This changes contents of te array items which is passed by reference.
   */
  updateRevsAndIds(insertResponse, insertedData) {
    for (let i = 0, len = insertResponse.length; i < len; i++) {
      if (insertResponse[i].error) {
        continue;
      }
      if (!insertedData[i]._id) {
        /* eslint-disable-next-line no-param-reassign */
        insertedData[i]._id = insertResponse[i].id;
      }
      /* eslint-disable-next-line no-param-reassign */
      insertedData[i]._rev = insertResponse[i].rev;
    }
  }

  /**
   * Generates saved requests data and inserts them into the data store if they
   * are missing.
   *
   * @param {object} opts See `generateSavedRequestData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertSavedRequestData(opts = {}) {
    const data = this.generateSavedRequestData(opts);
    const projectsDb = new PouchDB('legacy-projects');
    const response = await projectsDb.bulkDocs(data.projects);
    this.updateRevsAndIds(response, data.projects);
    const savedDb = new PouchDB('saved-requests');
    const response2 = await savedDb.bulkDocs(data.requests);
    this.updateRevsAndIds(response2, data.requests);
    return data;
  }

  /**
   * Generates and saves history data to the data store.
   *
   * @param {object} opts See `generateHistoryRequestsData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertHistoryRequestData(opts = {}) {
    const data = this.generateHistoryRequestsData(opts);
    const db = new PouchDB('history-requests');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves a list of project objects.
   *
   * @param {object} opts Configuration options:
   * - `projectsSize` (Number) A number of projects to generate.
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   * @return {Promise}
   */
  async insertProjectsData(opts = {}) {
    const data = this.generateProjects(opts);
    const db = new PouchDB('legacy-projects');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves websocket data to the data store.
   *
   * @param {object} opts See `generateUrlsData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertWebsocketData(opts = {}) {
    const data = this.generateUrlsData(opts);
    const db = new PouchDB('websocket-url-history');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves url history data to the data store.
   *
   * @param {object} opts See `generateUrlsData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertUrlHistoryData(opts = {}) {
    const data = this.generateUrlsData(opts);
    const db = new PouchDB('url-history');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves variables data to the data store.
   *
   * @param {object} opts See `generateVariablesData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertVariablesData(opts = {}) {
    const data = this.generateVariablesData(opts);
    const db = new PouchDB('variables');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves headers sets data to the data store.
   *
   * @param {object} opts See `generateHeadersSetsData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertHeadersSetsData(opts = {}) {
    const data = this.generateHeadersSetsData(opts);
    const db = new PouchDB('headers-sets');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves cookies data to the data store.
   *
   * @param {object} opts See `generateCookiesData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertCookiesData(opts = {}) {
    const data = this.generateCookiesData(opts);
    const db = new PouchDB('cookies');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves basic auth data to the data store.
   *
   * @param {object} opts See `generateBasicAuthData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertBasicAuthData(opts = {}) {
    const data = this.generateBasicAuthData(opts);
    const db = new PouchDB('auth-data');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  /**
   * Generates and saves host rules data to the data store.
   *
   * @param {object} opts See `generateHostRulesData`
   * for description.
   * @return {Promise} Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  async insertHostRulesData(opts = {}) {
    const data = this.generateHostRulesData(opts);
    const db = new PouchDB('host-rules');
    const response = await db.bulkDocs(data);
    this.updateRevsAndIds(response, data);
    return data;
  }

  async insertApiData(opts = {}) {
    const index = this.generateApiIndexList(opts);
    const data = this.generateApiDataList(index);
    const indexDb = new PouchDB('api-index');
    const indexResponse = await indexDb.bulkDocs(index);
    this.updateRevsAndIds(indexResponse, index);
    const dataDb = new PouchDB('api-data');
    const dataResponse = await dataDb.bulkDocs(data);
    this.updateRevsAndIds(dataResponse, data);
    return [index, data];
  }

  certificateToStore(cert) {
    if (typeof cert.data === 'string') {
      return cert;
    }
    const data = this.bufferToBase64(cert.data);
    const copy = { ...cert, type: 'buffer', data };
    return copy;
  }

  async insertCertificatesData(opts = {}) {
    const data = this.generateClientCertificates(opts);
    const responses = [];
    const indexDb = new PouchDB('client-certificates');
    const dataDb = new PouchDB('client-certificates-data');
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const dataDoc = {
        cert: this.certificateToStore(item.cert),
      };
      delete item.cert;
      if (item.key) {
        dataDoc.key = this.certificateToStore(item.key);
        delete item.key;
      }
      /* eslint-disable-next-line no-await-in-loop */
      const dataRes = await dataDb.post(dataDoc);
      item.dataKey = dataRes.id;
      /* eslint-disable-next-line no-await-in-loop */
      responses[responses.length] = await indexDb.post(item);
    }
    this.updateRevsAndIds(responses, data);
    return data;
  }

  /**
   * Destroys saved and projects database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroySavedRequestData() {
    const savedDb = new PouchDB('saved-requests');
    const projectsDb = new PouchDB('legacy-projects');
    await savedDb.destroy();
    await projectsDb.destroy();
  }

  /**
   * Destroys history database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyHistoryData() {
    const db = new PouchDB('history-requests');
    await db.destroy();
  }

  /**
   * Destroys legacy projects database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async clearLegacyProjects() {
    const db = new PouchDB('legacy-projects');
    await db.destroy();
  }

  /**
   * Destroys websockets URL history database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyWebsocketsData() {
    const db = new PouchDB('websocket-url-history');
    await db.destroy();
  }

  /**
   * Destroys URL history database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyUrlData() {
    const db = new PouchDB('url-history');
    await db.destroy();
  }

  /**
   * Destroys headers sets database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyHeadersData() {
    const db = new PouchDB('headers-sets');
    await db.destroy();
  }

  /**
   * Destroys variables and anvironments database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyVariablesData() {
    const db = new PouchDB('variables');
    const db2 = new PouchDB('variables-environments');
    await db.destroy();
    await db2.destroy();
  }

  /**
   * Destroys cookies database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyCookiesData() {
    const db = new PouchDB('cookies');
    await db.destroy();
  }

  /**
   * Destroys auth data database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyAuthData() {
    const db = new PouchDB('auth-data');
    await db.destroy();
  }

  /**
   * Destroys hosts data database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyHostRulesData() {
    const db = new PouchDB('host-rules');
    await db.destroy();
  }

  /**
   * Destroys api-index data database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyApiIndexData() {
    const db = new PouchDB('api-index');
    await db.destroy();
  }

  /**
   * Destroys api-data database.
   * @return {Promise} Resolved promise when the data are cleared.
   */
  async destroyApiData() {
    const db = new PouchDB('api-data');
    await db.destroy();
  }

  async destroyAllApiData() {
    await this.destroyApiIndexData();
    await this.destroyApiData();
  }

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
    await this.destroyHeadersData();
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
   * @return {Promise} Promise resolved to all read docs.
   */
  async getDatastoreData(name) {
    const db = new PouchDB(name);
    const response = await db.allDocs({
      include_docs: true,
    });
    return response.rows.map((item) => item.doc);
  }

  // Returns a promise with all saved requests
  async getDatastoreRequestData() {
    return this.getDatastoreData('saved-requests');
  }

  // Returns a promise with all legacy projects
  async getDatastoreProjectsData() {
    return this.getDatastoreData('legacy-projects');
  }

  // Returns a promise with all history requests
  async getDatastoreHistoryData() {
    return this.getDatastoreData('history-requests');
  }

  // Returns a promise with all variables
  async getDatastoreVariablesData() {
    return this.getDatastoreData('variables');
  }

  // Returns a promise with all environments
  async getDatastoreEnvironmentsData() {
    return this.getDatastoreData('variables-environments');
  }

  // Returns a promise with all headers sets
  async getDatastoreHeadersData() {
    return this.getDatastoreData('headers-sets');
  }

  // Returns a promise with all cookies
  async getDatastoreCookiesData() {
    return this.getDatastoreData('cookies');
  }

  // Returns a promise with all socket urls
  async getDatastoreWebsocketsData() {
    return this.getDatastoreData('websocket-url-history');
  }

  // Returns a promise with all url history
  async getDatastoreUrlsData() {
    return this.getDatastoreData('url-history');
  }

  // Returns a promise with all saved authorization data.
  async getDatastoreAuthData() {
    return this.getDatastoreData('auth-data');
  }

  // Returns a promise with all host rules data.
  async getDatastoreHostRulesData() {
    return this.getDatastoreData('host-rules');
  }

  // Returns a promise with all api-index data.
  async getDatastoreApiIndexData() {
    return this.getDatastoreData('api-index');
  }

  // Returns a promise with all api-data data.
  async getDatastoreHostApiData() {
    return this.getDatastoreData('api-data');
  }

  // Returns a promise with all client certificates and the data.
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
