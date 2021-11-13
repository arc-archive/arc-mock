import { ARCProject } from '@advanced-rest-client/events/src/models/Project';
import { ARCSavedRequest } from '@advanced-rest-client/events/src/request/ArcRequest';
import { DataMockInit, HarTimingInit, HttpRequestInit, HttpResponseRedirectStatusInit } from '@pawel-up/data-mock/types'

export interface ArcDataMockInit extends DataMockInit {
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
   * Request id to add to `requests` array.
   * This takes precedence over `autoRequestId`.
   */
  requestId?: string;
  /**
   * If set it generates request ID to add to `requests` array.
   * When both this and `requestId` are not set then no request is being generated.
   */
  autoRequestId?: boolean;
  /**
   * Options for creating sub folders in the folder.
   */
  folder?: ProjectSubFolderCreateInit;
}

export interface ProjectFolderCreateInit {
  /**
   * Request id to add to `requests` array.
   * This takes precedence over `autoRequestId`.
   */
  requestId?: string;
  /**
   * If set it generates request ID to add to `requests` array.
   * When both this and `requestId` are not set then no request is being generated.
   */
  autoRequestId?: boolean;
  /**
   * Options for creating sub folders in the folder.
   */
  folder?: ProjectSubFolderCreateInit;
}

export interface ProjectSubFolderCreateInit extends ProjectFolderCreateInit {
  /**
   * The number of folders to create.
   * @default 5
   */
  size?: number;
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
