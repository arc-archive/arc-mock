import { DataMock } from '@pawel-up/data-mock';
import { ArcDataMockInit } from '../types';
import { Authorization } from './lib/Authorization';
import { Certificates } from './lib/Certificates';
import { Cookies } from './lib/Cookies';
import { HostRules } from './lib/HostRules';
import { Http } from './lib/Http';
import { RestApi } from './lib/RestApi';
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
  /**
   * @param init The library init options.
   */
  constructor(init?: ArcDataMockInit);
}
