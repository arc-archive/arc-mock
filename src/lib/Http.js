import { Http as Base, Types, Lorem, Time } from '@pawel-up/data-mock';
import { randomValue } from '@pawel-up/data-mock/src/lib/Http.js';
import { HttpResponse } from './HttpResponse.js';

/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */
/** @typedef {import('@advanced-rest-client/events').ArcRequest.ARCHistoryRequest} ARCHistoryRequest */
/** @typedef {import('@advanced-rest-client/events').ArcRequest.ARCSavedRequest} ARCSavedRequest */
/** @typedef {import('@advanced-rest-client/events').Project.ARCProject} ARCProject */
/** @typedef {import('@advanced-rest-client/events').ArcRequest.TransportRequest} TransportRequest */
/** @typedef {import('../../types').RequestHistoryInit} RequestHistoryInit */
/** @typedef {import('../../types').RequestSavedInit} RequestSavedInit */
/** @typedef {import('../../types').ProjectCreateInit} ProjectCreateInit */
/** @typedef {import('../../types').GenerateSavedResult} GenerateSavedResult */
/** @typedef {import('../../types').TransportRequestInit} TransportRequestInit */

export class Http extends Base {
  /**
   * @param {ArcDataMockInit=} init 
   */
  constructor(init={}) {
    super(init);
    this.LAST_TIME = Date.now();
    this.types = new Types(init.seed);
    this.lorem = new Lorem(init);
    this.response = new HttpResponse(init);
    this.time = new Time(init);
  }

  /**
   * @param {RequestHistoryInit=} [opts={}]
   * @returns {ARCHistoryRequest}
   */
  history(opts={}) {
    const base = this.request(opts);
    this.LAST_TIME -= this.types.datetime().getTime();
    const midnight = this.time.midnight(this.LAST_TIME);

    const item = /** @type ARCHistoryRequest */ ({
      ...base,
      created: this.LAST_TIME,
      updated: this.LAST_TIME,
      type: 'history',
      midnight,
    });
    if (!opts.noId) {
      item._id = this.types.uuid();
    }
    return item;
  }

  /**
   * @param {RequestSavedInit=} [opts={}]
   * @returns {ARCSavedRequest}
   */
  saved(opts={}) {
    const base = this.request(opts);
    const time = this.types.datetime().getTime();
    const requestName = this.lorem.words(2);
    const description = this.description(opts);
    const midnight = this.time.midnight(this.LAST_TIME);
    const item = /** @type ARCSavedRequest */ ({
      ...base,
      created: time,
      updated: time,
      type: 'saved',
      name: requestName,
      midnight,
    });
    if (description) {
      item.description = description;
    }
    item._id = this.types.uuid();
    if (opts.project) {
      item.projects = [opts.project];
    }
    return item;
  }

  /**
   * Generates a description for a request.
   *
   * @param {RequestSavedInit=} opts Configuration options
   * @return {string|undefined} Items description.
   */
  description(opts={}) {
    const { noDescription, forceDescription } = opts;
    if (noDescription) {
      return undefined;
    }
    if (forceDescription) {
      return this.lorem.paragraph();
    }
    return this.types.boolean({ likelihood: 70 }) ? this.lorem.paragraph() : undefined;
  }

  /**
   * @param {number=} [size=25] The number of requests to generate.
   * @param {RequestHistoryInit=} init History init options.
   * @returns {ARCHistoryRequest[]}
   */
  listHistory(size = 25, init={}) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.history(init));
    }
    return result;
  }

  /**
   * @param {number=} [size=25] The number of requests to generate.
   * @param {RequestSavedInit=} init Saved init options
   * @returns {ARCSavedRequest[]}
   */
  listSaved(size = 25, init = {}) {
    const list = [];
    for (let i = 0; i < size; i++) {
      const project = this.pickProject(init);
      const opts = { ...init };
      if (project && project._id) {
        opts.project = project._id;
      }
      const item = this.saved(opts);
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
   * Picks a random project from the list of passed in `opts` projects.
   *
   * @param {RequestSavedInit=} opts
   * @return {ARCProject|undefined} A project or undefined.
   */
  pickProject(opts = {}) {
    if (!opts.projects || !opts.projects.length) {
      return undefined;
    }
    let allow;
    if (opts.forceProject) {
      allow = true;
    } else {
      allow = this.types.boolean();
    }
    if (allow) {
      return this[randomValue].pickOne(opts.projects);
    }
    return undefined;
  }

  /**
   * @param {ProjectCreateInit=} init 
   * @returns {ARCProject}
   */
  project(init={}) {
    const project = /** @type ARCProject */ ({
      _id: this.types.uuid(),
      name: this.lorem.sentence({ words: 2 }),
      order: 0,
      description: this.lorem.paragraph(),
      requests: [],
    });
    if (init.requestId) {
      project.requests.push(init.requestId);
    } else if (init.autoRequestId) {
      project.requests.push(this.types.uuid());
    }
    return project;
  }

  /**
   * @param {number=} [size=5]
   * @param {ProjectCreateInit=} [init={}]
   * @returns {ARCProject[]}
   */
  listProjects(size = 5, init = {}) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.project(init));
    }
    return result;
  }

  /**
   * @param {number=} requestsSize 
   * @param {number=} projectsSize 
   * @param {RequestSavedInit=} requestsInit 
   * @param {ProjectCreateInit=} projectInit 
   * @return {GenerateSavedResult} A map with `projects` and `requests` arrays.
   */
  savedData(requestsSize = 25, projectsSize = 5, requestsInit = {}, projectInit = {}) {
    const projects = this.listProjects(projectsSize, projectInit);
    const rCopy = { ...requestsInit };
    rCopy.projects = projects;
    const requests = this.listSaved(requestsSize, rCopy);
    return {
      requests,
      projects,
    };
  }

  /**
   * Generates a transport request object.
   * @param {TransportRequestInit=} [opts={}] Generate options
   * @returns {TransportRequest} The transport request object
   */
  transportRequest(opts={}) {
    const base = this.request(opts);
    const request = /** @type TransportRequest */ ({
      ...base,
      startTime: Date.now() - 1000,
      endTime: Date.now(),
    });
    if (!opts.noHttpMessage) {
      request.httpMessage = `GET / HTTP 1.1\n${request.headers}\n`;
      if (request.payload) {
        request.httpMessage += `\n${request.payload}\n`;
      }
      request.httpMessage += '\n';
    }
    return request;
  }
}
