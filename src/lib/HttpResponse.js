import { HttpResponse as Base, headersValue, payloadValue, typesValue, loremValue } from '@pawel-up/data-mock/src/lib/http/HttpResponse.js';
import { Har } from '@pawel-up/data-mock';

/** @typedef {import('@advanced-rest-client/events').ArcResponse.ResponseRedirect} ResponseRedirect */
/** @typedef {import('@advanced-rest-client/events').ArcResponse.RequestTime} RequestTime */
/** @typedef {import('@advanced-rest-client/events').ArcResponse.Response} Response */
/** @typedef {import('@advanced-rest-client/events').ArcResponse.ErrorResponse} ErrorResponse */
/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */
/** @typedef {import('@pawel-up/data-mock').DataMockLocale} DataMockLocale */
/** @typedef {import('../../types').HttpResponseRedirectInit} HttpResponseRedirectInit */
/** @typedef {import('../../types').HttpResponseArcInit} HttpResponseArcInit */

export class HttpResponse extends Base {

  /**
   * @param {ArcDataMockInit=} init The library init options.
   */
  constructor(init={}) {
    super(init);
    this.har = new Har(init);
  }

  /**
   * @param {number=} value
   */
  seed(value) {
    super.seed(value);
    this.har.seed(value);
  }

  /**
   * @param {DataMockLocale=} locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale) {
    super.locale(locale);
    this.har.locale(locale);
  }

  /**
   * @param {HttpResponseRedirectInit=} init 
   * @returns {ResponseRedirect} Generated redirect response.
   */
  redirectResponse(init={}) {
    const ct = init.body ? this[headersValue].contentType() : undefined;
    let headers = this[headersValue].headers('response', { mime: ct });
    const url = this[headersValue].link();
    headers += `\nlocation: ${url}`;
    const { code, status } = this.redirectStatus(init);
    const body = init.body ? this[payloadValue].payload(ct) : undefined;
    const startTime = this[typesValue].datetime().getTime();
    const duration = this[typesValue].number({ min: 10, max: 4000 });
    const result = /** @type ResponseRedirect */({
      response: {
        status: code,
        statusText: status,
        headers,
      },
      startTime,
      endTime: startTime + duration,
    });
    if (body) {
      result.response.payload = body;
    }
    if (init.timings) {
      result.timings = this.har.timing(init);
    }
    return result;
  }

  /**
   * @param {HttpResponseArcInit=} init 
   * @returns {Response}
   */
  arcResponse(init = {}) {
    const ct = init.noBody ? undefined : this[headersValue].contentType();
    const body = init.noBody ? undefined : this[payloadValue].payload(ct);
    const headers = this[headersValue].headers('response', { mime: ct });
    const statusGroup = init.statusGroup ? init.statusGroup : this[typesValue].number({ min: 2, max: 5 });
    const sCode = this[typesValue].number({ min: 0, max: 99 }).toString();
    const code = Number(`${statusGroup}${sCode.padStart(2, '0')}`);
    const status = this[loremValue].word();
    const length = this[typesValue].number({ min: 10, max: 4000 });
    const result = /** @type Response */({
      status: code,
      statusText: status,
      headers,
      loadingTime: length,
    });
    if (init.timings) {
      result.timings = this.har.timing(init);
    }
    if (!init.noBody) {
      result.payload = body;
    }
    if (!init.noSize) {
      const hSize = headers.length;
      const bSize = body ? body.length : 0;
      result.size = {
        request: this[typesValue].number({ min: 10 }),
        response: hSize + bSize,
      };
    }
    if (init.redirects) {
      const size = this[typesValue].number({ min: 1, max: 4 });
      const cnf = { timings: init.timings, body: true };
      result.redirects = new Array(size).fill(0).map(() => this.redirectResponse(cnf));
    }
    return result;
  }

  /**
   * @returns {ErrorResponse}
   */
  arcErrorResponse() {
    const error = new Error(this[loremValue].paragraph());
    const result = /** @type ErrorResponse */({
      status: 0,
      error,
    });
    return result;
  }
}
