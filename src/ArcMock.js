import { DataMock } from '@pawel-up/data-mock';
import { Authorization } from './lib/Authorization.js';
import { Certificates } from './lib/Certificates.js';
import { Cookies } from './lib/Cookies.js';
import { HostRules } from './lib/HostRules.js';
import { Http } from './lib/Http.js';
import { RestApi } from './lib/RestApi.js';
import { Urls } from './lib/Urls.js';
import { Variables } from './lib/Variables.js';

/** @typedef {import('../').ArcDataMockInit} ArcDataMockInit */

export class ArcMock extends DataMock {
  /**
   * @param {ArcDataMockInit=} init The library init options.
   */
  constructor(init) {
    super(init);

    this.http = new Http(init);
    this.variables = new Variables(init);
    this.cookies = new Cookies(init);
    this.hostRules = new HostRules(init);
    this.certificates = new Certificates(init);
    this.urls = new Urls(init);
    this.authorization = new Authorization(init);
    this.restApi = new RestApi(init);
  }
}
