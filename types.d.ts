import { ARCProject } from '@advanced-rest-client/arc-types/src/models/Project';
import { ARCSavedRequest } from '@advanced-rest-client/arc-types/src/request/ArcRequest';
import { DataMockInit, HarTimingInit, HttpRequestInit, HttpResponseRedirectStatusInit } from '@pawel-up/data-mock/types'

export interface ArcDataMockInit extends DataMockInit {
  /**
   * When using the `store` namespace you need to provide the reference to 
   * the PouchDB data store.
   * PouchDB has a legacy architecture and the import work differently 
   * for NodeJS and a browser. Because we don't want this library to work asynchronously,
   * we require initializing the pouchdb library beforehand.
   */
  store?: PouchDB.Static;
}

export interface RequestHistoryInit extends HttpRequestInit {
  noId?: boolean;
}

export interface RequestSavedInit extends HttpRequestInit {
  forceDescription?: boolean;
  noDescription?: boolean;
  project?: string;
  projects?: ARCProject[];
  forceProject?: boolean;
}

export interface TransportRequestInit extends HttpRequestInit {
  noHttpMessage?: boolean;
}

export interface ProjectCreateInit {
  /**
   * Request id to add to `requests` array
   */
  requestId?: string;
  /**
   * If set it generates request ID to add to `requests` array
   */
  autoRequestId?: boolean;
}

export declare interface GenerateSavedResult {
  projects: ARCProject[];
  requests: ARCSavedRequest[];
}

export interface VariableInit {
  defaultEnv?: boolean;
  randomEnv?: boolean;
}

export declare interface CertificateCreateInit {
  binary?: boolean;
  noPassphrase?: boolean;
  noKey?: boolean;
  noCreated?: boolean;
  type?: 'p12' | 'pem';
}

export declare interface HttpResponseRedirectInit extends HttpResponseRedirectStatusInit, HarTimingInit {
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

export declare interface HttpResponseArcInit extends HarTimingInit {
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

export declare interface RestApiIndexInit {
  versionSize?: number;
  order?: number;
}

export declare interface InsertSavedResult {
  projects: PouchDB.Core.ExistingDocument<ARCProject>[];
  requests: PouchDB.Core.ExistingDocument<ARCSavedRequest>[];
}
