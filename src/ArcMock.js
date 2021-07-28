import { DataMock } from '@pawel-up/data-mock';
import { Authorization } from './lib/Authorization';
import { Certificates } from './lib/Certificates';
import { Cookies } from './lib/Cookies';
import { HostRules } from './lib/HostRules';
import { Http } from './lib/Http';
import { RestApi } from './lib/RestApi';
import { Store } from './lib/Store';
import { Urls } from './lib/Urls';
import { Variables } from './lib/Variables';

/** @typedef {import('@pawel-up/data-mock/types').DataMockInit} DataMockInit */

export class ArcMock extends DataMock {
  /**
   * @param {DataMockInit=} init The library init options.
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
    this.store = new Store(init);
  }
}
