import { Chance } from 'chance';
import { Variable, Project, UrlHistory, HostRule, ClientCertificate, DataExport, ArcResponse, ArcRequest } from '@advanced-rest-client/arc-types'

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

export declare interface SizeCreateOptions {
  /**
   * The number of items to generate
   */
  size?: number;
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
  /**
   * Number of request to generate. Default to 25.
   */
  requestsSize?: number;
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

export declare interface InsertSavedResult {
  projects: PouchDB.Core.ExistingDocument<ProjectObject>[];
  requests: PouchDB.Core.ExistingDocument<SavedObject>[];
}

export declare interface GenerateSavedResult {
  projects: ProjectObject[];
  requests: SavedObject[];
}

export declare interface ApiIndexCreateOptions {
  versionSize?: number;
  order?: number;
}

export declare interface ApiIndexListCreateOptions extends ApiIndexCreateOptions, SizeCreateOptions {
}

export declare interface ApiIndexObject {
  order: number;
  title: string;
  type: string;
  _id: string;
  versions: string[];
  latest: string;
}

export declare interface ApiDataObject {
  data: string;
  indexId: string;
  _id: string;
  version: string;
}

export declare interface CertificateCreateOptions {
  binary?: boolean;
  noPassphrase?: boolean;
  noKey?: boolean;
  noCreated?: boolean;
  type?: 'p12' | 'pem';
  size?: number;
}

export declare interface ArcCertificateDataObject extends ClientCertificate.Certificate {
}

export declare interface ArcCertificateObject extends ClientCertificate.RequestCertificate {
}

export declare interface ArcCertificateIndexObject extends ClientCertificate.CertificateIndex {
}

export declare interface ArcCertificateIndexDataObject extends ClientCertificate.ClientCertificate {
}

export declare interface ArcExportCertificateObject extends DataExport.ExportArcClientCertificateData {
}

export declare interface CookieCreateOptions extends SizeCreateOptions {
}
export declare interface CookieObject {
  created: number;
  updated: number;
  expires: number;
  maxAge: number;
  name: string;
  value: string;
  _id: string;
  domain: string;
  hostOnly: boolean;
  httpOnly: boolean;
  lastAccess: number;
  path: string;
  persistent: boolean;
}

export declare interface BasicAuthObject {
  _id: string;
  type: string;
  url: string;
}

export declare interface HostRuleObject extends HostRule.HostRule {
  _id: string;
}

export declare interface VariablesCreateOptions extends SizeCreateOptions {
  defaultEnv?: boolean;
  randomEnv?: boolean;
}

export declare interface VariableObject extends Variable.Variable {
  /**
   * The name of the environment the variable is added to.
   */
  environment: string;
}

export declare interface HistoryObject {
  _id?: string;
  url: string;
  method: string;
  headers: string;
  payload?: string;
  created: number;
  updated: number;
  type: string;
  midnight: number;
}

export declare interface SavedRequestCreateOptions extends ProjectCreateOptions {
  projectsSize?: number;
  requestsSize?: number;
  projects?: ProjectObject[];
  project?: string;
  forceProject?: boolean;
}

export declare interface SavedObject extends HistoryObject {
  name: string;
  driveId?: string;
  description?: string;
  projects?: string[];
}

export declare interface ProjectObject extends Project.Project {
  _id: string;
}

export declare interface UrlObject extends UrlHistory.UrlHistory {
  _id: string;
}

export declare interface RedirectStatusOptions {
  /**
   * The redirection code. Otherwise a random pick is used
   */
  code?: number;
  /**
   * The status message to use.
   */
  status?: string;
}

export declare interface RedirectStatusObject {
  /**
   * The redirection code.
   */
  code: number;
  /**
   * The status message.
   */
  status: string;
}

export declare interface HarTimingsOptions {
  /**
   * Whether to add ssl entry.
   */
  ssl?: boolean;
}


export declare interface ResponseRedirectOptions extends RedirectStatusOptions, HarTimingsOptions {
  /**
   * When set it adds body to the response
   */
  body?: boolean;
  /**
   * The redirection code. Otherwise a random pick is used
   */
  code?: number;
  /**
   * Whether to generate timings object
   */
  timings?: boolean;
}

export declare interface ResponseOptions extends HarTimingsOptions {
  /**
   * When set it does not generate a response payload.
   */
  noBody?: boolean;
  /**
   * The first number of the status group. Other 2 are auto generated
   */
  statusGroup?: number;
  /**
   * Whether to generate timings object
   */
  timings?: boolean;
  /**
   * When set it ignores size information
   */
  noSize?: boolean;
  /**
   * Adds redirects to the request
   */
  redirects?: boolean;
}


export declare interface TransportRequestOptions {
  /**
   * When set it does not generate a request payload.
   */
  noBody?: boolean;
  /**
   * When set it does not generate a source HTTP message
   */
  noHttpMessage?: boolean;
}

export declare class DataGenerator {
  readonly payloadMethods: string[];

  readonly nonPayloadMethods: string[];

  readonly contentTypes: string[];
  readonly redirectCodes: number[];
  LAST_TIME: number;
  chance: Chance.Chance;

  constructor();
  /**
   * Sets a midnight on the timestamp
   */
  setMidnight(time: number): number;

  /**
   * Generates a random ARC legacy project object.
   *
   * @param opts Create options
   * @returns ARC's object.
   */
  createProjectObject(opts?: ProjectCreateOptions): ProjectObject;

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
   * @param opts Configuration options
   * @returns `true` if the request can carry a payload and `false` otherwise.
   */
  generateIsPayload(opts?: SavedCreateOptions): boolean;

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
  generatePayload(contentType?: string): string|undefined;

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
  generateDriveId(opts?: SavedCreateOptions): string|undefined;

  /**
   * Generates a description for a request.
   *
   * @param opts Configuration options:
   * -   `noDescription` (Boolean) if set then it will never generate a desc.
   * @returns {string|undefined} Items description.
   */
  generateDescription(opts?: SavedCreateOptions): string|undefined;

  /**
   * Generates random saved request item.
   *
   * @param opts Options to generate the request
   * @returns A request object
   */
  generateSavedItem(opts?: SavedCreateOptions): SavedObject;

  /**
   * Generates a history object.
   *
   * @param opts Options to generate the request.
   * @returns A request object
   */
  generateHistoryObject(opts?: HistoryObjectOptions): HistoryObject;

  /**
   * Picks a random project from the list of passed in `opts` projects.
   *
   * @param opts Configuration options
   * @returns {object|undefined} Project id or undefined.
   */
  pickProject(opts?: SavedRequestCreateOptions): ProjectObject| undefined;

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
  generateRequests(opts?: SavedRequestCreateOptions): SavedObject[];

  /**
   * Generates a list of project objects.
   *
   * @param opts Configuration options:
   * - `projectsSize` (Number) A number of projects to generate.
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   * @returns List of generated project objects.
   */
  generateProjects(opts?: SavedRequestCreateOptions): ProjectObject[];

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
  generateSavedRequestData(opts?: SavedRequestCreateOptions): GenerateSavedResult;

  /**
   * Generates history requests list
   *
   * @param opts Configuration options
   * Rest of configuration options are defined in
   * `generateHistoryObject`
   * @returns List of history requests objects
   */
  generateHistoryRequestsData(opts?: HistoryObjectOptions): HistoryObject[];

  /**
   * Generates a random data for a variable object
   * @param opts
   * - {Boolean} defaultEnv When set it always set environment to "default"
   * @returns A variable object.
   */
  generateVariableObject(opts?: VariablesCreateOptions): VariableObject;

  /**
   * Generates variables list
   *
   * @param opts Configuration options
   * @returns List of variables
   */
  generateVariablesData(opts?: VariablesCreateOptions): VariableObject[];

  // Generates random Cookie data
  generateCookieObject(): CookieObject;

  /**
   * Generates cookies list
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateCookiesData(opts?: CookieCreateOptions): CookieObject[];

  // Generates random URL data object
  generateUrlObject(): UrlObject;

  /**
   * Generates urls list
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateUrlsData(opts?: SizeCreateOptions): UrlObject[];

  /**
   * Generates random URL data object.
   */
  generateHostRuleObject(): HostRuleObject;

  /**
   * Generates host rules
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateHostRulesData(opts?: SizeCreateOptions): HostRuleObject[];

  /**
   * Generates random Basic authorization object.
   */
  generateBasicAuthObject(): BasicAuthObject;

  /**
   * Generates basic authorization data
   *
   * @param opts Configuration options:
   * -   `size` (Number) Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  generateBasicAuthData(opts?: SizeCreateOptions): BasicAuthObject[];

  generateApiIndex(opts?: ApiIndexListCreateOptions): ApiIndexObject;

  generateApiIndexList(opts?: ApiIndexListCreateOptions): ApiIndexObject[];

  generateApiData(index: ApiIndexObject): ApiDataObject[];

  generateApiDataList(indexes: ApiIndexObject[]): ApiDataObject[];

  /**
   * Transforms ASCII string to buffer.
   * @param asciiString
   */
  strToBuffer(asciiString: string): Uint8Array;

  /**
   * Converts incoming data to base64 string.
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
   * Creates a certificate structure.
   * @param opts Create options
   */
  generateCertificate(opts?: CertificateCreateOptions): ArcCertificateDataObject;

  /**
   * Creates a clientCertificate structure.
   * @param opts Create options
   */
  generateClientCertificate(opts?: CertificateCreateOptions): ArcCertificateObject;

  /**
   * Creates a list of ClientCertificate structure.
   * @param opts Create options
   */
  generateClientCertificates(opts?: CertificateCreateOptions): ArcCertificateObject[];

  /**
   * Creates a ClientCertificate transformed to the export object.
   */
  generateExportClientCertificate(opts?: CertificateCreateOptions): ArcExportCertificateObject;

  /**
   * Creates a list of ClientCertificates transformed for the export object.
   */
  generateExportClientCertificates(opts?: CertificateCreateOptions): ArcExportCertificateObject[];

  /**
   * Generates HAR timings object
   * @param {HarTimingsOptions} [opts={}] Generate data options
   * @returns {RequestTime}
   */
  generateHarTimings(opts?: HarTimingsOptions): ArcResponse.RequestTime;

  /**
   * @param {RedirectStatusOptions=} [opts={}] Generate data options
   * @returns {RedirectStatusObject}
   */
  generateRedirectStatus(opts?: RedirectStatusOptions): RedirectStatusObject;

  /**
   * Generates ARC redirect response object
   * @param {ResponseRedirectOptions=} [opts={}] Generate data options
   * @returns {ResponseRedirect}
   */
  generateRedirectResponse(opts?: ResponseRedirectOptions): ArcResponse.ResponseRedirect;

  /**
   * Generates a response object.
   * @param {ResponseOptions=} [opts={}] Generate options
   * @returns {Response} The response object
   */
  generateResponse(opts?: ResponseOptions): ArcResponse.Response;

  /**
   * Generates a response object.
   * @param opts Generate options
   * @returns The response object
   */
  generateTransportRequest(opts?: TransportRequestOptions): ArcRequest.TransportRequest;

  generateErrorResponse(): ArcResponse.ErrorResponse;

  /**
   * Preforms `insertSavedRequestData` if no requests data are in
   * the data store.
   * @param opts See `generateSavedRequestData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   */
  insertSavedIfNotExists(opts?: SavedRequestCreateOptions): Promise<InsertSavedResult>;

  /**
   * Preforms `insertHistoryRequestData` if no requests data are in
   * the data store.
   * @returns Resolved promise when data are inserted into the datastore.
   */
  insertHistoryIfNotExists(opts?: HistoryObjectOptions): Promise<PouchDB.Core.ExistingDocument<HistoryObject>[]>;

  /**
   * Creates `_id` on the original insert object if it wasn't created before and
   * updates `_rev` property.
   * @param insertResponse PouchDB build insert response
   * @param insertedData The original array of inserted objects.
   * This changes contents of te array items which is passed by reference.
   */
  updateRevsAndIds<T>(insertResponse: (PouchDB.Core.Response|PouchDB.Core.Error)[], insertedData: T[]): PouchDB.Core.ExistingDocument<T>[];

  /**
   * Generates saved requests data and inserts them into the data store if they
   * are missing.
   *
   * @param opts See `generateSavedRequestData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertSavedRequestData(opts?: SavedRequestCreateOptions): Promise<InsertSavedResult>;

  /**
   * Generates and saves history data to the data store.
   *
   * @param opts See `generateHistoryRequestsData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertHistoryRequestData(opts?: HistoryObjectOptions): Promise<PouchDB.Core.ExistingDocument<HistoryObject>[]>;

  /**
   * Generates and saves a list of project objects.
   *
   * @param opts Configuration options:
   * - `projectsSize` (Number) A number of projects to generate.
   * - requestId - Request id to add to `requests` array
   * - autoRequestId - If set it generates request ID to add to `requests` array
   */
  insertProjectsData(opts?: SavedRequestCreateOptions): Promise<PouchDB.Core.ExistingDocument<ProjectObject>[]>;

  /**
   * Generates and saves websocket data to the data store.
   *
   * @param opts See `generateUrlsData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertWebsocketData(opts?: SizeCreateOptions): Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>;

  /**
   * Generates and saves url history data to the data store.
   *
   * @param opts See `generateUrlsData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertUrlHistoryData(opts?: SizeCreateOptions): Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>;

  /**
   * Generates and saves variables data to the data store.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertVariablesData(opts?: VariablesCreateOptions): Promise<PouchDB.Core.ExistingDocument<VariableObject>[]>;

  /**
   * Generates and saves cookies data to the data store.
   *
   * @param opts See `generateCookiesData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertCookiesData(opts?: CookieCreateOptions): Promise<PouchDB.Core.ExistingDocument<CookieObject>[]>;

  /**
   * Generates and saves basic auth data to the data store.
   *
   * @param opts See `generateBasicAuthData`
   * for description.
   * @returns Resolved promise when data are inserted into the datastore.
   * Promise resolves to generated data object
   */
  insertBasicAuthData(opts?: SizeCreateOptions): Promise<PouchDB.Core.ExistingDocument<BasicAuthObject>[]>;

  /**
   * Generates and saves host rules data to the data store.
   *
   * @param opts Create options
   * @returns Resolved promise when data are inserted into the datastore.
   */
  insertHostRulesData(opts?: SizeCreateOptions): Promise<PouchDB.Core.ExistingDocument<HostRuleObject>[]>;

  insertApiData(opts?: ApiIndexListCreateOptions): Promise<PouchDB.Core.ExistingDocument<any>[]>;

  certificateToStore(cert: ArcCertificateDataObject): ArcCertificateDataObject;

  insertCertificatesData(opts?: CertificateCreateOptions): Promise<PouchDB.Core.ExistingDocument<ArcCertificateObject>[]>;

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
   * Destroys variables and environments database.
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
  getDatastoreRequestData(): Promise<PouchDB.Core.ExistingDocument<SavedObject>[]>;

  // Returns a promise with all legacy projects
  getDatastoreProjectsData(): Promise<PouchDB.Core.ExistingDocument<ProjectObject>[]>;

  // Returns a promise with all history requests
  getDatastoreHistoryData(): Promise<PouchDB.Core.ExistingDocument<HistoryObject>[]>;

  // Returns a promise with all variables
  getDatastoreVariablesData(): Promise<PouchDB.Core.ExistingDocument<VariableObject>[]>;

  // Returns a promise with all environments
  getDatastoreEnvironmentsData<T>(): Promise<PouchDB.Core.ExistingDocument<T>[]>;

  // Returns a promise with all cookies
  getDatastoreCookiesData(): Promise<PouchDB.Core.ExistingDocument<CookieObject>[]>;

  // Returns a promise with all socket urls
  getDatastoreWebsocketsData(): Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>;

  // Returns a promise with all url history
  getDatastoreUrlsData(): Promise<PouchDB.Core.ExistingDocument<UrlObject>[]>;

  // Returns a promise with all saved authorization data.
  getDatastoreAuthData(): Promise<PouchDB.Core.ExistingDocument<BasicAuthObject>[]>;

  // Returns a promise with all host rules data.
  getDatastoreHostRulesData<T>(): Promise<PouchDB.Core.ExistingDocument<HostRuleObject>[]>;

  // Returns a promise with all api-index data.
  getDatastoreApiIndexData<T>(): Promise<PouchDB.Core.ExistingDocument<ApiIndexObject>[]>;

  // Returns a promise with all api-data data.
  getDatastoreHostApiData<T>(): Promise<PouchDB.Core.ExistingDocument<ApiDataObject>[]>;

  // Returns a promise with all client certificates and the data.
  getDatastoreClientCertificates<T>(): Promise<PouchDB.Core.ExistingDocument<(ArcCertificateIndexObject|ArcCertificateIndexDataObject)[]>[]>;

  /**
   * Updates an object in an data store.
   *
   * @param dbName Name of the data store.
   * @param obj The object to be stored.
   * @returns A promise resolved to insert result.
   */
  updateObject(dbName: string, obj: object): Promise<PouchDB.Core.Response>;
}
