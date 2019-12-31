import 'pouchdb/dist/pouchdb.js';
import 'chance/dist/chance.min.js';
/* global Chance, PouchDB */
const chance = new Chance();
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
export const DataGenerator = {};
let LAST_TIME = Date.now();
const stringPool =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Sets a midnight on the timestamp
DataGenerator.setMidninght = function(time) {
  const now = new Date(time);
  now.setMilliseconds(0);
  now.setSeconds(0);
  now.setMinutes(0);
  now.setHours(0);
  return now.getTime();
};

/**
 * Generates a random ARC legacy project object.
 *
 * @param {Object} opts Create options:
 * - requestId - Request id to add to `requests` array
 * - autoRequestId - If set it generates request ID to add to `requests` array
 * @return {Object} ARC's object.
 */
DataGenerator.createProjectObject = function(opts) {
  opts = opts || {};
  const project = {
    _id: chance.guid({ version: 5 }),
    name: chance.sentence({ words: 2 }),
    order: 0,
    description: chance.paragraph(),
    requests: []
  };
  if (opts.requestId) {
    project.requests.push(opts.requestId);
  } else if (opts.autoRequestId) {
    project.requests.push(chance.guid({ version: 5 }));
  }
  return project;
};
DataGenerator.payloadMethods = ['POST', 'PUT', 'DELETE', 'OPTIONS'];
DataGenerator.nonPayloadMethods = ['GET', 'HEAD'];
DataGenerator.contentTypes = [
  'application/x-www-form-urlencoded',
  'application/json',
  'application/xml',
  'text/plain'
];
/**
 * Generates HTTP headers string.
 *
 * @param {?String} contentType
 * @param {Object} opts Configuration options:
 * - `noHeaders` (Boolean) will not generate headers string
 * (will set empty string)
 * @return {String} Valid HTTP headers string.
 */
DataGenerator.generateHeaders = function(contentType, opts) {
  opts = opts || {};
  let headers = '';
  if (!opts.noHeaders) {
    const headersSize = chance.integer({
      min: 0,
      max: 10
    });
    for (let i = 0; i < headersSize; i++) {
      headers += 'X-' + chance.word() + ': ' + chance.word() + '\n';
    }
  }
  if (contentType) {
    headers += 'content-type: ' + contentType + '\n';
  }
  return headers;
};
/**
 * Generates a HTTP method name for the request.
 *
 * @param {Boolean} isPayload If true it will use `opts.methodsPools` or
 * `DataGenerator.payloadMethods` to pick a method
 * from. Otherwise it will use
 * `DataGenerator.nonPayloadMethods` to pick a method from.
 * @param {Object} opts Configuration options:
 * -   `methodsPools` (Array<String>) List of methods to randomly pick from.
 *      It only relevant for a requests that can carry a payload.
 * @return {String} Randomly picked HTTP method name.
 */
DataGenerator.generateMethod = function(isPayload, opts) {
  opts = opts || {};
  if (opts.methodsPools) {
    return chance.pick(opts.methodsPools);
  }
  if (isPayload) {
    return chance.pick(DataGenerator.payloadMethods);
  }
  return chance.pick(DataGenerator.nonPayloadMethods);
};
/**
 * Randomly generates a boolean flag describing if the request can
 * carry a payload.
 * @param {Object} opts Configuration options:
 * -   `noPayload` (Boolean) If set the request will not have payload
 * -   `forcePayload` (Boolean) The request will always have a payload.
 *      THe `noPayload` property takes precedence over this setting.
 * @return {Boolean} `true` if the request can carry a payload and
 * `false` otherwise.
 */
DataGenerator.generateIsPayload = function(opts) {
  opts = opts || {};
  let isPayload = false;
  if (!opts.noPayload) {
    if (opts.forcePayload || chance.bool()) {
      isPayload = true;
    }
  }
  return isPayload;
};
/**
 * Generates a `content-type` header value.
 * @return {String} Value of the `content-type` header
 */
DataGenerator.generateContentType = function() {
  return chance.pick(DataGenerator.contentTypes);
};
/**
 * Generates a random x-www-form-urlencoded payload.
 * @return {String} The x-www-form-urlencoded payload.
 */
DataGenerator.generateUrlEncodedData = function() {
  const size = chance.integer({ min: 1, max: 10 });
  let result = '';
  for (let i = 0; i < size; i++) {
    const name = encodeURIComponent(chance.word()).replace(/%20/g, '+');
    const value = encodeURIComponent(chance.paragraph()).replace(/%20/g, '+');
    if (result) {
      result += '&';
    }
    result += name + '=' + value;
  }
  return result;
};
/**
 * Generates random JSON data.
 * @return {String} JSON payload
 */
DataGenerator.generateJsonData = function() {
  const size = chance.integer({
    min: 1, max: 10
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
    result += '"' + name + '":"' + value + '"';
  }
  result += '\n';
  result += '}';
  return result;
};
/**
 * Generates random XML data.
 * @return {String} XML payload
 */
DataGenerator.generateXmlData = function() {
  const size = chance.integer({ min: 1, max: 10 });
  let result = '<feed>';
  for (let i = 0; i < size; i++) {
    const name = chance.word();
    const value = chance.paragraph();
    result += '\n\t';
    result += '<' + name + '><![CDATA[' + value + ']]></' + name + '>';
  }
  result += '\n';
  result += '</feed>';
  return result;
};
/**
 * Generates random payload data for given `contentType`.
 * The `contentType` must be one of the `DataGenerator.contentTypes`.
 *
 * @param {String} contentType Content type of the data.
 * @return {String} Payload message.
 */
DataGenerator.generatePayload = function(contentType) {
  if (!contentType) {
    return;
  }
  switch (contentType) {
    case 'text/plain': return chance.paragraph();
    case 'application/x-www-form-urlencoded':
      return DataGenerator.generateUrlEncodedData();
    case 'application/json': return DataGenerator.generateJsonData();
    case 'application/xml': return DataGenerator.generateXmlData();
    default:
      throw new Error('Unknown payload.');
  }
};
/**
 * Generates a request timestamp that is within last month.
 * @return {Number} The timestamp
 */
DataGenerator.generateRequestTime = function() {
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();
  month--;
  if (month === -1) {
    month = 11;
    year--;
  }
  const randomDay = chance.date({ year: year, month: month });
  return randomDay.getTime();
};
/**
 * Generates Google Drive item ID.
 *
 * @param {Object} opts Configuration options:
 * -   `noGoogleDrive` (Boolean) if set then it will never generate Drive ID.
 * @return {String|undefined} Google Drive ID or undefined.
 */
DataGenerator.generateDriveId = function(opts) {
  if (opts && opts.noGoogleDrive) {
    return;
  }
  return chance.string({
    length: 32,
    pool: stringPool
  });
};
/**
 * Generates a description for a request.
 *
 * @param {Object} opts Configuration options:
 * -   `noDescription` (Boolean) if set then it will never generate a desc.
 * @return {String|undefined} Items description.
 */
DataGenerator.generateDescription = function(opts) {
  if (opts && opts.noDescription) {
    return;
  }
  return chance.bool({ likelihood: 70 }) ? chance.paragraph() : undefined;
};
/**
 * Generates random saved request item.
 *
 * @param {Object} opts Options to generate the request:
 * -   `noPayload` (Boolean) If set the request will not have payload
 * -   `forcePayload` (Boolean) The request will always have a payload.
 *      The `noPayload` property takes precedence over this setting.
 * -   `methodsPools` (Array<String>) List of methods to randomly pick one of
 * -   `noHeaders` (Boolean) will not generate headers string (will set empty
 *      string). If payload is generated then it will always contain a
 *      `content-type` header.
 * -   `noGoogleDrive` (Boolean) if set then it will never generate Drive ID.
 * -   `noDescription` (Boolean) if set then it will never generate a desc.
 * -   `project` (String) A project ID to add. It also add other project related
 *      properties.
 * @return {Object} A request object
 */
DataGenerator.generateSavedItem = function(opts) {
  opts = opts || {};
  const isPayload = DataGenerator.generateIsPayload(opts);
  const method = DataGenerator.generateMethod(isPayload, opts);
  const contentType = isPayload ? DataGenerator.generateContentType() :
    undefined;
  const headers = DataGenerator.generateHeaders(contentType, opts);
  const payload = DataGenerator.generatePayload(contentType);
  const time = DataGenerator.generateRequestTime();
  const requestName = chance.sentence({ words: 2 });
  const driveId = DataGenerator.generateDriveId(opts);
  const description = DataGenerator.generateDescription(opts);

  const item = {
    url: chance.url(),
    method: method,
    headers: headers,
    created: time,
    updated: time,
    type: 'saved',
    name: requestName
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
};

/**
 * Generates a history object.
 *
 * @param {Object} opts Options to generate the request:
 * -   `noPayload` (Boolean) If set the request will not have payload
 * -   `forcePayload` (Boolean) The request will always have a payload.
 *      The `noPayload` property takes precedence over this setting.
 * -   `methodsPools` (Array<String>) List of methods to randomly pick one of
 * -   `noHeaders` (Boolean) will not generate headers string (will set empty
 *      string). If payload is generated then it will always contain a
 *      `content-type` header.
 * -   `noId` (Boolen) If set it won't generate ID
 * @return {Object} A request object
 */
DataGenerator.generateHistoryObject = function(opts) {
  opts = opts || {};
  LAST_TIME -= chance.integer({ min: 1.8e+6, max: 8.64e+7 });
  const isPayload = DataGenerator.generateIsPayload(opts);
  const method = DataGenerator.generateMethod(isPayload, opts);
  const contentType = isPayload ? DataGenerator.generateContentType() : undefined;
  const headers = DataGenerator.generateHeaders(contentType, opts);
  const payload = DataGenerator.generatePayload(contentType);
  const url = chance.url();
  const item = {
    url: url,
    method: method,
    headers: headers,
    created: LAST_TIME,
    updated: LAST_TIME,
    type: 'history'
  };
  if (payload) {
    item.payload = payload;
  }
  if (!opts.noId) {
    item._id = chance.guid({ version: 5 });
  }
  return item;
};
/**
 * Picks a random project from the list of passed in `opts` projects.
 *
 * @param {Object} opts Configuration options:
 * -   `projects` (Array<Object>) List of generated projects
 * @return {Object|undefined} Project id or undefined.
 */
DataGenerator.pickProject = function(opts) {
  opts = opts || {};
  if (!opts.projects) {
    return;
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
};
/**
 * Generates a list of saved requests.
 *
 * @param {Object} opts Configuration options:
 * -   `projects` (Array<Object>) List of generated projects
 * -   `requestsSize` (Number) Number of request to generate. Default to 25.
 * Rest of configuration options are defined in
 * `DataGenerator.generateSavedItem`
 * @return {Array<Object>} List of requests.
 */
DataGenerator.generateRequests = function(opts) {
  opts = opts || {};
  const list = [];
  const size = opts.requestsSize || 25;
  for (let i = 0; i < size; i++) {
    const project = DataGenerator.pickProject(opts);
    const _opts = Object.assign({}, opts);
    _opts.project = project && project._id;
    const item = DataGenerator.generateSavedItem(_opts);
    if (project) {
      if (!project.requests) {
        project.requests = [];
      }
      project.requests.push(item._id);
    }
    list.push(item);
  }
  return list;
};
/**
 * Generates a list of project objects.
 *
 * @param {Object} opts Configuration options:
 * - `projectsSize` (Number) A number of projects to generate.
 * - requestId - Request id to add to `requests` array
 * - autoRequestId - If set it generates request ID to add to `requests` array
 * @return {Array<Object>} List of generated project objects.
 */
DataGenerator.generateProjects = function(opts) {
  opts = opts || {};
  const size = opts.projectsSize || 5;
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(DataGenerator.createProjectObject(opts));
  }
  return result;
};
/**
 * Generates requests data. That includes projects and requests.
 *
 * @param {Object} opts Configuration options:
 * -   `projectsSize` (Number) A number of projects to generate.
 * -   `requestsSize` (Number) Number of request to generate. Default to 25.
 * Rest of configuration options are defined in
 * `DataGenerator.generateSavedItem`
 * @return {Object} A map with `projects` and `requests` arrays.
 */
DataGenerator.generateSavedRequestData = function(opts) {
  opts = opts || {};
  const projects = DataGenerator.generateProjects(opts);
  opts.projects = projects;
  const requests = DataGenerator.generateRequests(opts);
  return {
    requests: requests,
    projects: projects
  };
};
/**
 * Generates history requests list
 *
 * @param {Object} opts Configuration options:
 * -   `requestsSize` (Number) Number of request to generate. Default to 25.
 * Rest of configuration options are defined in
 * `DataGenerator.generateHistoryObject`
 * @return {Array} List of history requests objects
 */
DataGenerator.generateHistoryRequestsData = function(opts) {
  opts = opts || {};
  const size = opts.requestsSize || 25;
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(DataGenerator.generateHistoryObject(opts));
  }
  return result;
};

/**
 * Generates a random data for a variable object
 * @param {Object} opts
 * - {Boolean} defaultEnv When set it always set environment to "default"
 * @return {Object} A variable object.
 */
DataGenerator.generateVariableObject = function(opts) {
  opts = opts || {};
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
    _id: chance.guid({ version: 5 })
  };
  if (isDefault) {
    result.environment = 'default';
  } else {
    result.environment = chance.sentence({ words: 2 });
  }
  return result;
};
/**
 * Generates variables list
 *
 * @param {Object} opts Configuration options:
 * -   `size` (Number) Number of variables to generate. Default to 25.
 * @return {Array} List of variables
 */
DataGenerator.generateVariablesData = function(opts) {
  opts = opts || {};
  const size = opts.size || 25;
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(DataGenerator.generateVariableObject(opts));
  }
  return result;
};
/**
 * Generate a header set datastore entry
 *
 * @param {Object} opts Generation options:
 * -   `noHeaders` (Boolean) will not generate headers string (will set empty
 *      string)
 * -   `noPayload` (Boolean) If set the request will not have payload
 * -   `forcePayload` (Boolean) The request will always have a payload.
 *      THe `noPayload` property takes precedence over this setting.
 * @return {[type]} [description]
 */
DataGenerator.generateHeaderSetObject = function(opts) {
  const time = chance.hammertime();

  const isPayload = DataGenerator.generateIsPayload(opts);
  const contentType = isPayload ? DataGenerator.generateContentType() :
    undefined;
  const headers = DataGenerator.generateHeaders(contentType, opts);

  const result = {
    created: time,
    updated: time,
    order: chance.integer({ min: 0, max: 10 }),
    name: chance.sentence({ words: 2 }),
    headers,
    _id: chance.guid({ version: 5 })
  };
  return result;
};
/**
 * Generates headers sets list
 *
 * @param {Object} opts Configuration options:
 * -   `size` (Number) Number of items to generate. Default to 25.
 * @return {Array} List of datastore entries.
 */
DataGenerator.generateHeadersSetsData = function(opts) {
  opts = opts || {};
  const size = opts.size || 25;
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(DataGenerator.generateHeaderSetObject(opts));
  }
  return result;
};
// Generates random Cookie data
DataGenerator.generateCookieObject = function() {
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
    path: chance.bool() ? '/' : '/' + chance.word(),
    persistent: chance.bool()
  };
  return result;
};
/**
 * Generates cookies list
 *
 * @param {Object} opts Configuration options:
 * -   `size` (Number) Number of items to generate. Default to 25.
 * @return {Array} List of datastore entries.
 */
DataGenerator.generateCookiesData = function(opts) {
  opts = opts || {};
  const size = opts.size || 25;
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(DataGenerator.generateCookieObject());
  }
  return result;
};
// Generates random URL data object
DataGenerator.generateUrlObject = function() {
  const result = {
    time: chance.hammertime(),
    cnt: chance.integer({ min: 100, max: 1000 }),
    _id: chance.url()
  };
  return result;
};
/**
 * Generates urls list
 *
 * @param {Object} opts Configuration options:
 * -   `size` (Number) Number of items to generate. Default to 25.
 * @return {Array} List of datastore entries.
 */
DataGenerator.generateUrlsData = function(opts) {
  opts = opts || {};
  const size = opts.size || 25;
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(DataGenerator.generateUrlObject());
  }
  return result;
};
/**
 * Generates random URL data object.
 * @return {Object}
 */
DataGenerator.generateHostRuleObject = function() {
  const result = {
    _id: chance.guid({ version: 5 }),
    from: chance.url(),
    to: chance.url(),
    enabled: chance.bool(),
    comment: chance.string()
  };
  return result;
};
/**
 * Generates host rules
 *
 * @param {Object} opts Configuration options:
 * -   `size` (Number) Number of items to generate. Default to 25.
 * @return {Array} List of datastore entries.
 */
DataGenerator.generateHostRulesData = function(opts) {
  if (!opts) {
    opts = {};
  }
  opts.size = opts.size || 25;
  const result = [];
  for (let i = 0; i < opts.size; i++) {
    result.push(DataGenerator.generateHostRuleObject());
  }
  return result;
};
/**
 * Generates random Basic authorization object.
 * @return {Object}
 */
DataGenerator.generateBasicAuthObject = function() {
  const result = {
    _id: 'basic/' + chance.string(),
    type: 'basic',
    url: chance.url()
  };
  return result;
};
/**
 * Generates basic authorization data
 *
 * @param {Object} opts Configuration options:
 * -   `size` (Number) Number of items to generate. Default to 25.
 * @return {Array} List of datastore entries.
 */
DataGenerator.generateBasicAuthData = function(opts) {
  if (!opts) {
    opts = {};
  }
  opts.size = opts.size || 25;
  const result = [];
  for (let i = 0; i < opts.size; i++) {
    result.push(DataGenerator.generateBasicAuthObject());
  }
  return result;
};

DataGenerator.generateApiIndex = function(opts) {
  opts = opts || {};
  const result = {};
  const versionsSize = opts.versionSize ? opts.versionSize : chance.integer({ min: 1, max: 5 });
  const versions = [];
  let last;
  for (let i = 0; i < versionsSize; i++) {
    last = versions[versions.length] = `v${i}`;
  }
  result.order = opts.order || 0;
  result.title = chance.sentence({ words: 2 });
  result.type = 'RAML 1.0';
  result._id = chance.url();
  result.versions = versions;
  result.latest = last;
  return result;
};

DataGenerator.generateApiIndexList = function(opts) {
  if (!opts) {
    opts = {};
  }
  opts.size = opts.size || 25;
  const result = [];
  for (let i = 0; i < opts.size; i++) {
    result.push(DataGenerator.generateApiIndex({
      order: i
    }));
  }
  return result;
};

DataGenerator.generateApiData = function(index, opts) {
  opts = opts || {};
  const result = [];
  index.versions.forEach((version) => {
    const item = {
      data: '[{}]',
      indexId: index._id,
      version,
      _id: index._id + '|' + version
    };
    result[result.length] = item;
  });
  return result;
};

DataGenerator.generateApiDataList = function(indexes, opts) {
  if (!opts) {
    opts = {};
  }
  const size = indexes.length;
  let result = [];
  for (let i = 0; i < size; i++) {
    const data = DataGenerator.generateApiData(indexes[i], opts);
    result = result.concat(data);
  }
  return result;
};
/**
 * Transforms ASCII string to buffer.
 * @param {String} asciiString
 * @return {Uint8Array}
 */
DataGenerator.strToBuffer = function(asciiString) {
  return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)));
};
/**
 * Converts incomming data to base64 string.
 * @param {ArrayBuffer|Buffer} ab
 * @return {String} Safe to store string.
 */
DataGenerator.bufferToBase64 = function (ab) {
  return btoa(String.fromCharCode(...ab));
};
/**
 * Converts base64 string to Uint8Array.
 * @param {String} str
 * @return {Uint8Array} Restored array view.
 */
DataGenerator.base64ToBuffer = function(str) {
  const asciiString = atob(str);
  return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)));
};
/**
 * Creates a certificate struct.
 * @param {?Object} opts
 * - binary {Boolean}
 * - noPassphrase {Boolean}
 * @return {Object}
 */
DataGenerator.generateCertificate = function(opts) {
  if (!opts) {
    opts = {};
  }
  let data = chance.paragraph();
  if (opts.binary) {
    data = DataGenerator.strToBuffer(data);
  }
  const result = {
    data
  };
  if (!opts.noPassphrase) {
    result.passphrase = chance.word();
  }
  return result;
};
/**
 * Creates a clientCertificate struct.
 * @param {?Object} opts
 * - binary {Boolean}
 * - noPassphrase {Boolean}
 * - type {String} - `p12` or `pem`
 * - noKey {Boolean}
 * - noCreated {Boolean}
 * @return {Object}
 */
DataGenerator.generateClientCertificate = function(opts) {
  if (!opts) {
    opts = {};
  }
  const type = opts.type ? opts.type : chance.pick(['p12', 'pem']);
  const cert = DataGenerator.generateCertificate(opts);
  const name = chance.word();
  const result = {
    type,
    name,
    cert
  };
  if (!opts.noKey) {
    result.key = DataGenerator.generateCertificate(opts);
  }
  if (!opts.noCreated) {
    result.created = Date.now();
  }
  return result;
};
/**
 * Creates a list of ClientCertificate struct.
 * @param {?Object} opts
 * - size {Number} - default 15
 * - binary {Boolean}
 * - noPassphrase {Boolean}
 * - type {String} - `p12` or `pem`
 * - noKey {Boolean}
 * - noCreated {Boolean}
 * @return {Array<Object>}
 */
DataGenerator.generateClientCertificates = function(opts) {
  if (!opts) {
    opts = {};
  }
  const size = opts.size || 15;
  const result = [];
  for (let i = 0; i < size; i++) {
    result[result.length] = DataGenerator.generateClientCertificate(opts);
  }
  return result;
};

/**
 * Preforms `DataGenerator.insertSavedRequestData` if no requests data are in
 * the data store.
 * @param {Object} opts See `DataGenerator.generateSavedRequestData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 */
DataGenerator.insertSavedIfNotExists = async function(opts) {
  opts = opts || {};
  const savedDb = new PouchDB('saved-requests');
  const response = await savedDb.allDocs({
    include_docs: true
  });
  if (!response.rows.length) {
    return await DataGenerator.insertSavedRequestData(opts);
  }
  const result = {
    requests: response.rows.map(function(item) {
      return item.doc;
    })
  };
  const projectsDb = new PouchDB('legacy-projects');
  const projectsResponse = await projectsDb.allDocs({
    include_docs: true
  });
  result.projects = projectsResponse.rows.map(function(item) {
    return item.doc;
  });
  return result;
};
/**
 * Preforms `DataGenerator.insertHistoryRequestData` if no requests data are in
 * the data store.
 * @param {Object} opts See `DataGenerator.insertHistoryRequestData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 */
DataGenerator.insertHistoryIfNotExists = async function(opts) {
  opts = opts || {};
  const db = new PouchDB('history-requests');
  const response = await db.allDocs({
    include_docs: true
  });
  if (!response.rows.length) {
    return await DataGenerator.insertHistoryRequestData(opts);
  } else {
    return response.rows.map((item) => item.doc);
  }
};
/**
 * Creates `_id` on the original insert object if it wasn't created before and
 * updates `_rev` property.
 * @param {Array<Object>} insertResponse PouchDB build insert response
 * @param {Array<Object>} insertedData The original array of inserted objects.
 * This changes contents of te array items which is passed by reference.
 */
function updateRevsAndIds(insertResponse, insertedData) {
  for (let i = 0, len = insertResponse.length; i < len; i++) {
    if (insertResponse[i].error) {
      continue;
    }
    if (!insertedData[i]._id) {
      insertedData[i]._id = insertResponse[i].id;
    }
    insertedData[i]._rev = insertResponse[i].rev;
  }
}
/**
 * Generates saved requests data and inserts them into the data store if they
 * are missing.
 *
 * @param {Object} opts See `DataGenerator.generateSavedRequestData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertSavedRequestData = async function(opts) {
  opts = opts || {};
  const data = DataGenerator.generateSavedRequestData(opts);
  const projectsDb = new PouchDB('legacy-projects');
  const response = await projectsDb.bulkDocs(data.projects);
  updateRevsAndIds(response, data.projects);
  const savedDb = new PouchDB('saved-requests');
  const response2 = await savedDb.bulkDocs(data.requests);
  updateRevsAndIds(response2, data.requests);
  return data;
};
/**
 * Generates and saves history data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateHistoryRequestsData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertHistoryRequestData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateHistoryRequestsData(opts);
  const db = new PouchDB('history-requests');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves a list of project objects.
 *
 * @param {Object} opts Configuration options:
 * - `projectsSize` (Number) A number of projects to generate.
 * - requestId - Request id to add to `requests` array
 * - autoRequestId - If set it generates request ID to add to `requests` array
 * @return {Promise}
 */
DataGenerator.insertProjectsData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateProjects(opts);
  const db = new PouchDB('legacy-projects');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves websocket data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateUrlsData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertWebsocketData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateUrlsData(opts);
  const db = new PouchDB('websocket-url-history');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves url history data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateUrlsData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertUrlHistoryData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateUrlsData(opts);
  const db = new PouchDB('url-history');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves variables data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateVariablesData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertVariablesData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateVariablesData(opts);
  const db = new PouchDB('variables');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves headers sets data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateHeadersSetsData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertHeadersSetsData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateHeadersSetsData(opts);
  const db = new PouchDB('headers-sets');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves cookies data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateCookiesData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertCookiesData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateCookiesData(opts);
  const db = new PouchDB('cookies');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves basic auth data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateBasicAuthData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertBasicAuthData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateBasicAuthData(opts);
  const db = new PouchDB('auth-data');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
/**
 * Generates and saves host rules data to the data store.
 *
 * @param {Object} opts See `DataGenerator.generateHostRulesData`
 * for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertHostRulesData = async (opts) => {
  opts = opts || {};
  const data = DataGenerator.generateHostRulesData(opts);
  const db = new PouchDB('host-rules');
  const response = await db.bulkDocs(data);
  updateRevsAndIds(response, data);
  return data;
};
DataGenerator.insertApiData = async function(opts) {
  if (!opts) {
    opts = {};
  }
  const index = DataGenerator.generateApiIndexList(opts);
  const data = DataGenerator.generateApiDataList(index, opts);
  const indexDb = new PouchDB('api-index');
  const indexResponse = await indexDb.bulkDocs(index);
  updateRevsAndIds(indexResponse, index);
  const dataDb = new PouchDB('api-data');
  const dataResponse = await dataDb.bulkDocs(data);
  updateRevsAndIds(dataResponse, data);
  return [index, data];
};

function certificateToStore(cert) {
  if (typeof cert.data === 'string') {
    return cert;
  }
  cert.type = 'buffer';
  cert.data = DataGenerator.bufferToBase64(cert.data);
  return cert;
};

DataGenerator.insertCertificatesData = async function(opts) {
  if (!opts) {
    opts = {};
  }
  const data = DataGenerator.generateClientCertificates(opts);
  const responses = [];
  const indexDb = new PouchDB('client-certificates');
  const dataDb = new PouchDB('client-certificates-data');
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const dataDoc = {
      cert: certificateToStore(item.cert)
    };
    delete item.cert;
    if (item.key) {
      dataDoc.key = certificateToStore(item.key);
      delete item.key;
    }
    const dataRes = await dataDb.post(dataDoc);
    item.dataKey = dataRes.id;
    responses[responses.length] = await indexDb.post(item);
  }
  updateRevsAndIds(responses, data);
  return data;
};
/**
 * Destroys saved and projects database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroySavedRequestData = async () => {
  const savedDb = new PouchDB('saved-requests');
  const projectsDb = new PouchDB('legacy-projects');
  await savedDb.destroy();
  await projectsDb.destroy();
};
/**
 * Destroys history database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyHistoryData = async () => {
  const db = new PouchDB('history-requests');
  await db.destroy();
};
/**
 * Destroys legacy projects database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.clearLegacyProjects = async () => {
  const db = new PouchDB('legacy-projects');
  await db.destroy();
};
/**
 * Destroys websockets URL history database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyWebsocketsData = async () => {
  const db = new PouchDB('websocket-url-history');
  await db.destroy();
};
/**
 * Destroys URL history database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyUrlData = async () => {
  const db = new PouchDB('url-history');
  await db.destroy();
};
/**
 * Destroys headers sets database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyHeadersData = async () => {
  const db = new PouchDB('headers-sets');
  await db.destroy();
};
/**
 * Destroys variables and anvironments database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyVariablesData = async () => {
  const db = new PouchDB('variables');
  const db2 = new PouchDB('variables-environments');
  await db.destroy();
  await db2.destroy();
};
/**
 * Destroys cookies database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyCookiesData = async () => {
  const db = new PouchDB('cookies');
  await db.destroy();
};
/**
 * Destroys auth data database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyAuthData = async () => {
  const db = new PouchDB('auth-data');
  await db.destroy();
};
/**
 * Destroys hosts data database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyHostRulesData = async () => {
  const db = new PouchDB('host-rules');
  await db.destroy();
};
/**
 * Destroys api-index data database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyApiIndexData = async () => {
  const db = new PouchDB('api-index');
  await db.destroy();
};
/**
 * Destroys api-data database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyApiData = async () => {
  const db = new PouchDB('api-data');
  await db.destroy();
};

DataGenerator.destroyAllApiData = async () => {
  await DataGenerator.destroyApiIndexData();
  await DataGenerator.destroyApiData();
};

DataGenerator.destroyClientCertificates = async () => {
  await new PouchDB('client-certificates').destroy();
  await new PouchDB('client-certificates-data').destroy();
};
/**
 * Destroys all databases.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroyAll = async () => {
  await DataGenerator.destroySavedRequestData();
  await DataGenerator.destroyHistoryData();
  await DataGenerator.destroyWebsocketsData();
  await DataGenerator.destroyUrlData();
  await DataGenerator.destroyHeadersData();
  await DataGenerator.destroyVariablesData();
  await DataGenerator.destroyCookiesData();
  await DataGenerator.destroyAuthData();
  await DataGenerator.destroyHostRulesData();
  await DataGenerator.destroyApiIndexData();
  await DataGenerator.destroyApiData();
  await DataGenerator.destroyClientCertificates();
};
/**
 * Deeply clones an object.
 * @param {Array|Date|Object} obj Object to be cloned
 * @return {Array|Date|Object} Copied object
 */
DataGenerator.clone = function(obj) {
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
      copy[i] = DataGenerator.clone(obj[i]);
    }
    return copy;
  }
  if (obj instanceof Object) {
    copy = {};
    Object.keys(obj).forEach((key) => {
      copy[key] = DataGenerator.clone(obj[key]);
    });
    return copy;
  }
  throw new Error('Unable to copy obj! Its type isn\'t supported.');
};

/**
 * Reads all data from a data store.
 * @param {String} name Name of the data store to read from. Without
 * `_pouch_` prefix
 * @return {Promise} Promise resolved to all read docs.
 */
DataGenerator.getDatastoreData = async function(name) {
  const db = new PouchDB(name);
  const response = await db.allDocs({
    include_docs: true
  });
  return response.rows.map((item) => item.doc);
};
// Returns a promise with all saved requests
DataGenerator.getDatastoreRequestData = function() {
  return DataGenerator.getDatastoreData('saved-requests');
};
// Returns a promise with all legacy projects
DataGenerator.getDatastoreProjectsData = function() {
  return DataGenerator.getDatastoreData('legacy-projects');
};
// Returns a promise with all history requests
DataGenerator.getDatastoreHistoryData = function() {
  return DataGenerator.getDatastoreData('history-requests');
};
// Returns a promise with all variables
DataGenerator.getDatastoreVariablesData = function() {
  return DataGenerator.getDatastoreData('variables');
};
// Returns a promise with all environments
DataGenerator.getDatastoreEnvironmentsData = function() {
  return DataGenerator.getDatastoreData('variables-environments');
};
// Returns a promise with all headers sets
DataGenerator.getDatastoreHeadersData = function() {
  return DataGenerator.getDatastoreData('headers-sets');
};
// Returns a promise with all cookies
DataGenerator.getDatastoreCookiesData = function() {
  return DataGenerator.getDatastoreData('cookies');
};
// Returns a promise with all socket urls
DataGenerator.getDatastoreWebsocketsData = function() {
  return DataGenerator.getDatastoreData('websocket-url-history');
};
// Returns a promise with all url history
DataGenerator.getDatastoreUrlsData = function() {
  return DataGenerator.getDatastoreData('url-history');
};
// Returns a promise with all saved authorization data.
DataGenerator.getDatastoreAuthData = function() {
  return DataGenerator.getDatastoreData('auth-data');
};
// Returns a promise with all host rules data.
DataGenerator.getDatastoreHostRulesData = function() {
  return DataGenerator.getDatastoreData('host-rules');
};
// Returns a promise with all api-index data.
DataGenerator.getDatastoreApiIndexData = function() {
  return DataGenerator.getDatastoreData('api-index');
};
// Returns a promise with all api-data data.
DataGenerator.getDatastoreHostApiData = function() {
  return DataGenerator.getDatastoreData('api-data');
};
// Returns a promise with all client certificates and the data.
DataGenerator.getDatastoreClientCertificates = async function() {
  const certs = await DataGenerator.getDatastoreData('client-certificates');
  const data = await DataGenerator.getDatastoreData('client-certificates-data');
  return [certs, data];
};
/**
 * Updates an object in an data store.
 *
 * @param {String} dbName Name of the data store.
 * @param {Object} obj The object to be stored.
 * @return {Promise} A promise resolved to insert result.
 */
DataGenerator.updateObject = function(dbName, obj) {
  const db = new PouchDB(dbName);
  return db.put(obj, {
    force: true
  });
};
