export declare interface ProjectCreateOptions {
  /**
   * Request id to add to `requests` array
   */
  requestId?: string;
  /**
   * If set it generates request ID to add to `requests` array
   */
  autoRequestId?: boolean;
}
export declare interface HeaderCreateOptions {
  /**
   * Will not generate headers string
   */
  noHeaders?: boolean;
}
export declare interface MethodCreateOptions {
  /**
   * List of methods to randomly pick from. It is only relevant for a requests that can carry a payload.
   */
  methodsPools?: string[];
}

export declare interface BaseRequestOptions extends HeaderCreateOptions, MethodCreateOptions {
  /**
   * If set the request will not have payload
   */
  noPayload?: boolean;
  /**
   * The request will always have a payload. The `noPayload` property takes precedence over this setting.
   */
  forcePayload?: boolean;
}

export declare interface HistoryObjectOptions extends BaseRequestOptions {
  /**
   * If set it won't generate ID
   */
  noId?: boolean;
}

export declare interface SavedCreateOptions extends BaseRequestOptions {
  /**
   * if set then it will never generate Drive ID.
   */
  noGoogleDrive?: boolean;
  /**
   * if set then it will never generate a desc.
   */
  noDescription?: boolean;
  /**
   * A project ID to add. It also add other project related properties.
   */
  project?: string;
}

export declare interface InsertSavedResult<T> {
  projects: PouchDB.Core.ExistingDocument<T>[];
  requests: PouchDB.Core.ExistingDocument<T>[];
}

export declare interface ApiIndexCreateOptions {
  versionSize: number;
  order: number;
}

export declare interface ApiIndexListCreateOptions extends ApiIndexCreateOptions {
  size: number;
}


export declare class DataGenerator {
  readonly payloadMethods: string[];

  readonly nonPayloadMethods: string[];

  readonly contentTypes: string[];

  /**
   * Sets a midnight on the timestamp
   */
  setMidninght(time: number): number;

  /**
   * Generates a random ARC legacy project object.
   *
   * @param opts Create options:
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   * @returns ARC's object.
   */
  createProjectObject(opts?: ProjectCreateOptions): object;

  /**
   * Generates HTTP headers string.
   *
   * @param contentType
   * @param opts Configuration options
   * @returns Valid HTTP headers string.
   */
  generateHeaders(contentType?: string, opts?: HeaderCreateOptions): string;

  /**
   * Generates a HTTP method name for the request.
   *
   * @param isPayload If true it will use `opts.methodsPools` or
   * `this.payloadMethods` to pick a method
   * from. Otherwise it will use `this.nonPayloadMethods` to pick a method from.
   * @param opts Configuration options
   * @returns Randomly picked HTTP method name.
   */
  generateMethod(isPayload?: boolean, opts?: MethodCreateOptions): string;

  /**
   * Randomly generates a boolean flag describing if the request can
   * carry a payload.
   * @param opts Configuration options:
   * -   `noPayload` (Boolean) If set the request will not have payload
   * -   `forcePayload` (Boolean) The request will always have a payload.
   *      The `noPayload` property takes precedence over this setting.
   * @returns `true` if the request can carry a payload and
   * `false` otherwise.
   */
  generateIsPayload(opts?: object): boolean;

  /**
   * Generates a `content-type` header value.
   * @returns Value of the `content-type` header
   */
  generateContentType(): string;

  /**
   * Generates a random x-www-form-urlencoded payload.
   * @returns The x-www-form-urlencoded payload.
   */
  generateUrlEncodedData(): string;

  /**
   * Generates random JSON data.
   * @returns JSON payload
   */
  generateJsonData(): string;

  /**
   * Generates random XML data.
   * @returns XML payload
   */
  generateXmlData(): string;

  /**
   * Generates random payload data for given `contentType`.
   * The `contentType` must be one of the `contentTypes`.
   *
   * @param contentType Content type of the data.
   * @returns Payload message.
   */
  generatePayload(contentType?: string): string;

  /**
   * Generates a request timestamp that is within last month.
   * @returns The timestamp
   */
  generateRequestTime(): number;

  /**
   * Generates Google Drive item ID.
   *
   * @param opts Configuration options:
   * -   `noGoogleDrive` (Boolean) if set then it will never generate Drive ID.
   * @returns {string|undefined} Google Drive ID or undefined.
   */
  generateDriveId(opts?: object): string|undefined;

  /**
   * Generates a description for a request.
   *
   * @param opts Configuration options:
   * -   `noDescription` (Boolean) if set then it will never generate a desc.
   * @returns {string|undefined} Items description.
   */
  generateDescription(opts?: object): string|undefined;

  /**
   * Generates random saved request item.
   *
   * @param opts Options to generate the request
   * @returns A request object
   */
  generateSavedItem(opts?: SavedCreateOptions): object;

  /**
   * Generates a history object.
   *
   * @param opts Options to generate the request.
   * @returns A request object
   */
  generateHistoryObject(opts?: HistoryObjectOptions): object;

  /**
   * Picks a random project from the list of passed in `opts` projects.
   *
   * @param opts Configuration options:
   * -   `projects` (Array<Object>) List of generated projects
   * @returns {object|undefined} Project id or undefined.
   */
  pickProject(opts?: object): object| undefined;

  /**
   * Generates a list of saved requests.
   *
   * @param opts Configuration options:
   * -   `projects` (Array<Object>) List of generated projects
   * -   `requestsSize` (Number) Number of request to generate. Default to 25.
   * Rest of configuration options are defined in
   * `generateSavedItem()`
   * @returns List of requests.
   */
  generateRequests(opts?: object): object[];

  /**
   * Generates a list of project objects.
   *
   * @param opts Configuration options:
   * - `projectsSize` (Number) A number of projects to generate.
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   * @returns List of generated project objects.
   */
  generateProjects(opts?: object): object[];

  /**
   * Generates requests data. That includes projects and requests.
   *
   * @param opts Configuration options:
   * -   `projectsSize` (Number) A number of projects to generate.
   * -   `requestsSize` (Number) Number of request to generate. Default to 25.
   * Rest of configuration options are defined in
   * `generateSavedItem`
   * @returns A map with `projects` and `requests` arrays.
   */
  generateSavedRequestData(opts?: object): object;

  /**
   * Generates history requests list
   *
   * @param opts Configuration options:
   * -   `requestsSize` (Number) Number of request to generate. Default to 25.
   * Rest of configuration options are defined in
   * `generateHistoryObject`
   * @returns List of history requests objects
   */
  generateHistoryRequestsData(opts?: object): object[];

  /**
   * Generates a random data for a variable object
   * @param opts
   * - {Boolean} defaultEnv When set it always set environment to "default"
   * @returns A variable object.
   */
  generateVariableObject(opts?: object): object;

  /**
   * Generates variables list
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of variables to generate. Default to 25.
   * @returns List of variables
   */
  generateVariablesData(opts?: object): object[];

  /**
   * Generate a header set datastore entry
   *
   * @param opts Generation options:
   * -   `noHeaders` (Boolean) will not generate headers string (will set empty
   *      string)
   * -   `noPayload` (Boolean) If set the request will not have payload
   * -   `forcePayload` (Boolean) The request will always have a payload.
   *      THe `noPayload` property takes precedence over this setting.
   * @returns
   */
  generateHeaderSetObject(opts?: object): object;

  /**
   * Generates headers sets list
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateHeadersSetsData(opts?: object): object[];

  // Generates random Cookie data
  generateCookieObject(): object;

  /**
   * Generates cookies list
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateCookiesData(opts?: object): object[];

  // Generates random URL data object
  generateUrlObject(): object;

  /**
   * Generates urls list
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateUrlsData(opts?: object): object[];

  /**
   * Generates random URL data object.
   */
  generateHostRuleObject(): object;

  /**
   * Generates host rules
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateHostRulesData(opts?: object): object[];

  /**
   * Generates random Basic authorization object.
   */
  generateBasicAuthObject(): object;

  /**
   * Generates basic authorization data
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateBasicAuthData(opts?: object): object[];

  generateApiIndex(opts?: ApiIndexListCreateOptions): object;

  generateApiIndexList(opts: ApiIndexListCreateOptions): object[];

  generateApiData(index: any): object;

  generateApiDataList(indexes: any[]): object[];

  /**
   * Transforms ASCII string to buffer.
   * @param asciiString
   */
  strToBuffer(asciiString: string): Uint8Array;

  /**
   * Converts incomming data to base64 string.
   * @param ab
   * @returns Safe to store string.
   */
  bufferToBase64(ab: ArrayBuffer|Buffer): string;

  /**
   * Converts base64 string to Uint8Array.
   * @param str
   * @returns {Uint8Array} Restored array view.
   */
  base64ToBuffer(str: string): Uint8Array;

  /**
   * Creates a certificate struct.
   * @param opts
   * - binary {Boolean}
   * - noPassphrase {Boolean}
   */
  generateCertificate<T>(opts?: object): T;

  /**
   * Creates a clientCertificate struct.
   * @param opts
   * - binary {Boolean}
   * - noPassphrase {Boolean}
   * - type - `p12` or `pem`
   * - noKey {Boolean}
   * - noCreated {Boolean}
   */
  generateClientCertificate<T>(opts?: object): T;

  /**
   * Creates a list of ClientCertificate struct.
   * @param opts
   * - size {number} - default 15
   * - binary {Boolean}
   * - noPassphrase {Boolean}
   * - type - `p12` or `pem`
   * - noKey {Boolean}
   * - noCreated {Boolean}
   */
  generateClientCertificates<T>(opts?: object): T[];

  /**
   * Preforms `insertSavedRequestData` if no requests data are in
   * the data store.
   * @param opts See `generateSavedRequestData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   */
  insertSavedIfNotExists<T>(opts?: object): Promise<InsertSavedResult<T>>;

  /**
   * Preforms `insertHistoryRequestData` if no requests data are in
   * the data store.
   * @param opts See `insertHistoryRequestData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   */
  insertHistoryIfNotExists<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Creates `_id` on the original insert object if it wasn't created before and
   * updates `_rev` property.
   * @param insertResponse PouchDB build insert response
   * @param insertedData The original array of inserted objects.
   * This changes contents of te array items which is passed by reference.
   */
  updateRevsAndIds(insertResponse: object[], insertedData: object[]): void;

  /**
   * Generates saved requests data and inserts them into the data store if they
   * are missing.
   *
   * @param opts See `generateSavedRequestData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertSavedRequestData<T>(opts?: object): Promise<InsertSavedResult<T>>;

  /**
   * Generates and saves history data to the data store.
   *
   * @param opts See `generateHistoryRequestsData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertHistoryRequestData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves a list of project objects.
   *
   * @param opts Configuration options:
   * - `projectsSize` (Number) A number of projects to generate.
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   */
  insertProjectsData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves websocket data to the data store.
   *
   * @param opts See `generateUrlsData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertWebsocketData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves url history data to the data store.
   *
   * @param opts See `generateUrlsData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertUrlHistoryData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves variables data to the data store.
   *
   * @param opts See `generateVariablesData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertVariablesData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves headers sets data to the data store.
   *
   * @param opts See `generateHeadersSetsData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertHeadersSetsData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves cookies data to the data store.
   *
   * @param opts See `generateCookiesData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertCookiesData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves basic auth data to the data store.
   *
   * @param opts See `generateBasicAuthData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertBasicAuthData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Generates and saves host rules data to the data store.
   *
   * @param opts See `generateHostRulesData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertHostRulesData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  insertApiData<T>(opts?: ApiIndexListCreateOptions): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  certificateToStore(cert: object): object;

  insertCertificatesData<T>(opts?: object): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Destroys saved and projects database.
   * @returns Resolved promise when the data are cleared.
   */
  destroySavedRequestData(): Promise<void>;

  /**
   * Destroys history database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyHistoryData(): Promise<void>;

  /**
   * Destroys legacy projects database.
   * @returns Resolved promise when the data are cleared.
   */
  clearLegacyProjects(): Promise<void>;

  /**
   * Destroys websockets URL history database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyWebsocketsData(): Promise<void>;

  /**
   * Destroys URL history database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyUrlData(): Promise<void>;

  /**
   * Destroys headers sets database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyHeadersData(): Promise<void>;

  /**
   * Destroys variables and anvironments database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyVariablesData(): Promise<void>;

  /**
   * Destroys cookies database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyCookiesData(): Promise<void>;

  /**
   * Destroys auth data database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyAuthData(): Promise<void>;

  /**
   * Destroys hosts data database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyHostRulesData(): Promise<void>;

  /**
   * Destroys api-index data database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyApiIndexData(): Promise<void>;

  /**
   * Destroys api-data database.
   * @returns Resolved promise when the data are cleared.
   */
  destroyApiData(): Promise<void>;

  destroyAllApiData(): Promise<void>;

  destroyClientCertificates(): Promise<void>;

  /**
   * Destroys all databases.
   * @returns Resolved promise when the data are cleared.
   */
  destroyAll(): Promise<void>;

  /**
   * Deeply clones an object.
   * @param obj Object to be cloned
   * @returns Copied object
   */
  clone<T>(obj: T): T;

  /**
   * Reads all data from a data store.
   * @param name Name of the data store to read from. Without
   * `_pouch_` prefix
   * @returns Promise resolved to all read docs.
   */
  getDatastoreData<T>(name: string): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all saved requests
  getDatastoreRequestData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all legacy projects
  getDatastoreProjectsData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all history requests
  getDatastoreHistoryData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all variables
  getDatastoreVariablesData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all environments
  getDatastoreEnvironmentsData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all headers sets
  getDatastoreHeadersData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all cookies
  getDatastoreCookiesData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all socket urls
  getDatastoreWebsocketsData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all url history
  getDatastoreUrlsData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all saved authorization data.
  getDatastoreAuthData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all host rules data.
  getDatastoreHostRulesData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all api-index data.
  getDatastoreApiIndexData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all api-data data.
  getDatastoreHostApiData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all client certificates and the data.
  getDatastoreClientCertificates<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  /**
   * Updates an object in an data store.
   *
   * @param dbName Name of the data store.
   * @param obj The object to be stored.
   * @returns A promise resolved to insert result.
   */
  updateObject(dbName: string, obj: object): Promise<PouchDB.Core.Response>;
}
