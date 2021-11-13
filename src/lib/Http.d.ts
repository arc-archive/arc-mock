import { ARCProject, ProjectFolder } from '@advanced-rest-client/events/src/models/Project';
import { ARCHistoryRequest, ARCSavedRequest, TransportRequest } from '@advanced-rest-client/events/src/request/ArcRequest';
import { Http as Base, Types, Lorem } from '@pawel-up/data-mock';
import { ArcDataMockInit, GenerateSavedResult, ProjectCreateInit, RequestHistoryInit, RequestSavedInit, TransportRequestInit, ProjectFolderCreateInit } from '../../types';
import { HttpResponse } from './HttpResponse';

export declare class Http extends Base {
  LAST_TIME: number;
  types: Types;
  lorem: Lorem;
  response: HttpResponse;
  constructor(init?: ArcDataMockInit);

  /**
   * Generates an ARC history object.
   */
  history(init?: RequestHistoryInit): ARCHistoryRequest;

  /**
   * Generates random saved request item.
   */
  saved(init?: RequestSavedInit): ARCSavedRequest;

  /**
   * Generates a description for a request.
   *
   * @param init Configuration options
   * @return Items description.
   */
  description(init?: RequestSavedInit): string | undefined;

  /**
   * @param size The number of requests to generate. Default to 25.
   * @param init History init options.
   */
  listHistory(size?: number, init?: RequestHistoryInit): ARCHistoryRequest[];

  /**
   * @param size The number of requests to generate.. Default to 25.
   * @param init Saved init options
   */
  listSaved(size?: number, init?: RequestSavedInit): ARCSavedRequest[];

  /**
   * Picks a random project from the list of passed in `opts` projects.
   *
   * @return A project or undefined.
   */
  pickProject(init?: RequestSavedInit): ARCProject | undefined;

  /**
   * Generates a random ARC legacy project object.
   * @param init Create options
   * @returns ARC's project object.
   */
  project(init?: ProjectCreateInit): ARCProject;

  /**
   * Generates a list of project objects.
   * 
   * @returns List of generated project objects.
   */
  listProjects(size?: number, init?: ProjectCreateInit): ARCProject[];

  projectFolder(init?: ProjectFolderCreateInit): ProjectFolder;

  /**
   * @param size The number of folders to create. Default to 5.
   */
  projectFolders(size?: number, init?: ProjectFolderCreateInit): ProjectFolder[];

  /**
   * @returns A map with `projects` and `requests` arrays.
   */
  savedData(requestsSize?: number, projectsSize?: number, requestsInit?: RequestSavedInit, projectInit?: ProjectCreateInit): GenerateSavedResult;

  /**
   * Generates a transport request object.
   * @param init Generate options
   * @returns The transport request object
   */
  transportRequest(init?: TransportRequestInit): TransportRequest;
}
