// tslint:disable:variable-name Describing an API that's defined elsewhere.

declare interface ProjectObject {
  _id: String;
  name: String;
  order: Number;
  description: String;
  requests: String[];
}
declare interface ProjectCreateOptions {
  requestId?: String;
  autoRequestId?: Boolean;
}
declare interface HeadersCreateOptions {
  noHeaders?: Boolean;
}
declare interface MethodCreateOptions {
  methodsPools?: String[];
}
declare interface IsPayloadCreateOptions {
  noPayload?: Boolean;
  forcePayload?: Boolean;
}
declare interface DriveIdCreateOptions {
  noGoogleDrive?: Boolean;
}
declare interface DescriptionCreateOptions {
  noDescription?: Boolean;
}
declare interface PickProjectOptions {
  projects?: String[];
  forceProject?: Boolean;
}
declare interface SavedRequestCreateOptions extends DescriptionCreateOptions,
  DriveIdCreateOptions, IsPayloadCreateOptions, MethodCreateOptions, HeadersCreateOptions,
  ProjectCreateOptions {
  project?: String;
}
declare interface HistoryRequestCreateOptions extends IsPayloadCreateOptions, MethodCreateOptions, HeadersCreateOptions {
  noId?: Boolean;
}
declare interface HistoryRequest {
  _id: String;
  url: String;
  method: String;
  headers?: String;
  created: Number,
  updated: Number,
  type: String;
  payload?: String;
}
declare interface SavedRequest extends HistoryRequest {
  name: String;
  description: String;
  projects: String[];
  driveId?: String;
}

declare interface GenerateSavedOptions extends SavedRequestCreateOptions {
  projects?: String[];
  requestsSize?: Number;
}
declare interface GenerateHistoryOptions extends HistoryRequestCreateOptions {
  requestsSize?: Number;
}
declare interface GenerateProjectsOptions extends ProjectCreateOptions {
  projectsSize?: Number;
}
declare interface SavedRequestData {
  requests: SavedRequest[];
  projects: ProjectObject[]
}
declare interface GenerateSavedRequestDataOptions extends ProjectCreateOptions, SavedRequestCreateOptions {
}

export { DataGenerator };
declare interface DataGenerator {
  payloadMethods: String[];
  nonPayloadMethods: String[];
  contentTypes: String[];
  setMidninght(time: Number): Date;
  createProjectObject(opts: ProjectCreateOptions) : ProjectObject;
  generateHeaders(contentType: String, opts: HeadersCreateOptions): String;
  generateMethod(isPayload: Boolean, opts: MethodCreateOptions): String;
  generateIsPayload(opts: IsPayloadCreateOptions): Boolean;
  generateContentType(): String;
  generateUrlEncodedData(): String;
  generateJsonData(): String;
  generateXmlData(): String;
  generatePayload(contentType: String): String;
  generateRequestTime(): Number;
  generateDriveId(opts: DriveIdCreateOptions): String;
  generateDescription(opts: DescriptionCreateOptions): String;
  generateSavedItem(opts: SavedRequestCreateOptions): SavedRequest;
  generateHistoryObject(opts: HistoryRequestCreateOptions): HistoryRequest;
  pickProject(opts: PickProjectOptions): String|undefined;
  generateRequests(opts: GenerateSavedOptions): SavedRequest[];
  generateProjects(opts: GenerateProjectsOptions): ProjectObject[];
  generateSavedRequestData(opts: GenerateSavedRequestDataOptions): SavedRequestData;
  generateHistoryRequestsData(opts: GenerateHistoryOptions): HistoryRequest[];
  generateVariableObject(opts: Object): Object[];
  generateVariablesData(opts: Object): Object[];
  generateHeaderSetObject(opts: Object): Object[];
  generateHeadersSetsData(opts: Object): Object[];
  generateCookieObject(): Object[];
  generateCookiesData(opts: Object): Object[];
  generateUrlObject(): Object[];
  generateUrlsData(opts: Object): Object[];
  generateHostRuleObject(): Object[];
  generateHostRulesData(opts: Object): Object[];
  generateBasicAuthObject(): Object[];
  generateBasicAuthData(opts: Object): Object[];
  generateApiIndex(opts: Object): Object[];
  generateApiIndexList(opts: Object): Object[];
  generateApiData(index: Object, opts: Object): Object[];
  generateApiDataList(indexes: Object[], opts: Object): Object[];
  strToBuffer(asciiString: String): Uint8Array;
  bufferToBase64(ab: ArrayBuffer|Buffer): String;
  base64ToBuffer(str: String): Uint8Array;
  generateCertificate(opts: Object): Object;
  generateClientCertificate(opts: Object): Object;
  generateClientCertificates(opts: Object): Object[];
  insertSavedIfNotExists(opts: Object): Promise<Object>;
  insertHistoryIfNotExists(opts: Object): Promise<Object[]>;
  updateRevsAndIds(insertResponse: Object[], insertedData: Object[]): void;
  insertSavedRequestData(opts: GenerateSavedRequestDataOptions): Promise<SavedRequestData>;
  insertHistoryRequestData(opts: GenerateHistoryOptions): Promise<HistoryRequest[]>;
  insertProjectsData(opts: GenerateProjectsOptions): Promise<ProjectObject[]>;
  insertWebsocketData(opts: Object): Promise<Object[]>;
  insertUrlHistoryData(opts: Object): Promise<Object[]>;
  insertVariablesData(opts: Object): Promise<Object[]>;
  insertHeadersSetsData(opts: Object): Promise<Object[]>;
  insertCookiesData(opts: Object): Promise<Object[]>;
  insertBasicAuthData(opts: Object): Promise<Object[]>;
  insertHostRulesData(opts: Object): Promise<Object[]>;
  insertApiData(opts: Object): Promise<Array<Object[]>>;
  insertCertificatesData(opts: Object): Promise<Object[]>;
  destroySavedRequestData(): Promise<void>;
  destroyHistoryData(): Promise<void>;
  clearLegacyProjects(): Promise<void>;
  destroyWebsocketsData(): Promise<void>;
  destroyUrlData(): Promise<void>;
  destroyHeadersData(): Promise<void>;
  destroyVariablesData(): Promise<void>;
  destroyCookiesData(): Promise<void>;
  destroyAuthData(): Promise<void>;
  destroyHostRulesData(): Promise<void>;
  destroyApiIndexData(): Promise<void>;
  destroyApiData(): Promise<void>;
  destroyAllApiData(): Promise<void>;
  destroyClientCertificates(): Promise<void>;
  destroyAll(): Promise<void>;
  clone(obj: Object): Object;
  getDatastoreData(): Promise<Object[]>;
  getDatastoreRequestData(): Promise<Object[]>;
  getDatastoreProjectsData(): Promise<Object[]>;
  getDatastoreHistoryData(): Promise<Object[]>;
  getDatastoreVariablesData(): Promise<Object[]>;
  getDatastoreEnvironmentsData(): Promise<Object[]>;
  getDatastoreHeadersData(): Promise<Object[]>;
  getDatastoreCookiesData(): Promise<Object[]>;
  getDatastoreWebsocketsData(): Promise<Object[]>;
  getDatastoreUrlsData(): Promise<Object[]>;
  getDatastoreAuthData(): Promise<Object[]>;
  getDatastoreHostRulesData(): Promise<Object[]>;
  getDatastoreApiIndexData(): Promise<Object[]>;
  getDatastoreHostApiData(): Promise<Object[]>;
  getDatastoreClientCertificates(): Promise<Array<Object[]>>;
  updateObject(dbName: String, obj: Object): Promise<Object[]>;
}
