import { DataMock, DataMockInit } from '@pawel-up/data-mock';
import { Authorization } from './lib/Authorization';
import { Certificates } from './lib/Certificates';
import { Cookies } from './lib/Cookies';
import { HostRules } from './lib/HostRules';
import { Http } from './lib/Http';
import { RestApi } from './lib/RestApi';
import { Store } from './lib/Store';
import { Urls } from './lib/Urls';
import { Variables } from './lib/Variables';

export declare class ArcMock extends DataMock {
  http: Http;
  variables: Variables;
  cookies: Cookies;
  hostRules: HostRules;
  certificates: Certificates;
  urls: Urls;
  authorization: Authorization;
  restApi: RestApi;
  store: Store;
  /**
   * @param init The library init options.
   */
  constructor(init?: DataMockInit);
}
