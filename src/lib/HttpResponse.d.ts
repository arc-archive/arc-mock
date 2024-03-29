import { HttpResponse as Base } from '@pawel-up/data-mock/src/lib/http/HttpResponse.js';
import { DataMockLocale, Har } from '@pawel-up/data-mock';
import { ErrorResponse, Response, ResponseRedirect } from '@advanced-rest-client/events/src/request/ArcResponse';
import { ArcDataMockInit, HttpResponseArcInit, HttpResponseRedirectInit } from '../../types';

export declare class HttpResponse extends Base {
  har: Har;
  /**
   * @param init The library init options.
   */
  constructor(init?: ArcDataMockInit);
  seed(value?: number): void;
  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale: DataMockLocale): void;

  /**
   * @returns Generated redirect response.
   */
  redirectResponse(init?: HttpResponseRedirectInit): ResponseRedirect;
  arcResponse(init?: HttpResponseArcInit): Response;
  arcErrorResponse(): ErrorResponse;
}
