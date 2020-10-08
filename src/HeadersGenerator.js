/* global Chance */

/**
 * @type {Chance.Chance}
 */
// @ts-ignore
const chance = new Chance();

export const HeadersSchema = {
  'date': {
    group: 'general',
    request: true,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      return (new Date()).toUTCString();
    },
  },
  'cache-control': {
    group: 'general,caching',
    request: [
      'max-age={{number}}',
      'max-stale',
      'min-fresh={{number}}',
      'no-cache',
      'no-store',
      'no-transform',
      'only-if-cached'
    ],
    response: [
      'must-revalidate',
      'no-cache',
      'no-store',
      'no-transform',
      'public',
      'private',
      'proxy-revalidate',
      'max-age={{number}}',
      's-maxage={{number}}'
    ],
    /** 
     * @param {string} type
     * @returns {string}
     */
    generate: (type) => {
      const picks = HeadersSchema['cache-control'][type];
      const value = /** @type string */ (chance.pickone(picks));
      return value.replace('{{number}}', chance.integer({min: 1, max: 500000 }).toString());
    }
  },
  connection: {
    group: 'general',
    enum: ['keep-alive', 'close'],
    request: true,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      return chance.pickone(HeadersSchema.connection.enum);
    },
  },
  age: {
    group: 'caching',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      return chance.integer({min: 1, max: 500000 }).toString();
    },
  },
  expires: {
    group: 'caching',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      const time = chance.hammertime();
      return (new Date(time)).toUTCString();
    },
  },
  pragma: {
    group: 'caching',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      return 'no-cache';
    },
  },
  'last-modified': {
    group: 'conditional',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      const time = chance.hammertime();
      return (new Date(time)).toUTCString();
    },
  },
  etag: {
    group: 'conditional',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      return `W/${chance.hash()}`;
    },
  },
  'if-match': {
    group: 'conditional',
    request: true,
    response: false,
    /**
     * @returns {string}
     */
    generate: () => {
      return `W/${chance.hash()}`;
    },
  },
  'if-none-match': {
    group: 'conditional',
    request: true,
    response: false,
    /**
     * @returns {string}
     */
    generate: () => {
      return `W/${chance.hash()}`;
    },
  },
  'if-modified-since': {
    group: 'conditional',
    request: true,
    response: false,
    /**
     * @returns {string}
     */
    generate: () => {
      const time = chance.hammertime();
      return (new Date(time)).toUTCString();
    },
  },
  accept: {
    group: 'content',
    request: true,
    response: false,
    enum: ['*/*', 'text/html', 'image/*', 'application/xhtml+xml', 'application/xml;q=0.9', 'application/json'],
    /**
     * @returns {string}
     */
    generate: () => {
      const picks = HeadersSchema.accept.enum;
      return chance.pickone(picks);
    },
  },
  'accept-charset': {
    group: 'content',
    request: true,
    response: false,
    enum: ['utf-8', 'iso-8859-1;q=0.5'],
    /**
     * @returns {string}
     */
    generate: () => {
      const picks = HeadersSchema['accept-charset'].enum;
      return chance.pickone(picks);
    },
  },
  'accept-encoding': {
    group: 'content',
    request: true,
    response: false,
    enum: ['gzip', 'compress', 'deflate', 'br', 'identity', '*', 'gzip;q=1.0', '*;q=0.5'],
    /**
     * @returns {string}
     */
    generate: () => {
      const picks = HeadersSchema['accept-encoding'].enum;
      return chance.pickone(picks);
    },
  },
  cookie: {
    group: 'cookies',
    request: true,
    response: false,
    /**
     * @returns {string}
     */
    generate: () => {
      const size = chance.integer({ min: 1, max: 4 });
      return new Array(size).fill(0).map(() => `${chance.word()}=${chance.word()}`).join('; ');
    },
  },
  'set-cookie': {
    group: 'cookies',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      const size = chance.integer({ min: 1, max: 4 });
      return new Array(size).fill(0).map(() => `${chance.word()}=${chance.word()}`).join('; ');
    },
  },
  'access-control-allow-origin': {
    group: 'cors',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      return chance.bool() ? chance.domain() : '*';
    },
  },
  origin: {
    group: 'cors',
    request: true,
    response: false,
    /**
     * @returns {string}
     */
    generate: () => {
      return chance.bool() ? chance.domain() : '*';
    },
  },
  'content-length': {
    group: 'content',
    request: true,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      return chance.integer({ min: 0, max: 1000000 }).toString();
    },
  },
  'content-type': {
    group: 'content',
    request: true,
    response: true,
    enum: [
      'text/html', 'image/png', 'application/xml', 'application/json', 'text-plain',
      'application/x-www-form-urlencoded',
    ],
    /**
     * @returns {string}
     */
    generate: () => {
      const picks = HeadersSchema['content-type'].enum;
      return chance.pickone(picks);
    },
  },
  'content-encoding': {
    group: 'content',
    request: true,
    response: true,
    enum: ['gzip', 'compress', 'deflate', 'br', 'identity', '*', 'gzip;q=1.0', '*;q=0.5'],
    /**
     * @returns {string}
     */
    generate: () => {
      const picks = HeadersSchema['content-encoding'].enum;
      return chance.pickone(picks);
    },
  },
  'transfer-encoding': {
    group: 'content',
    request: false,
    response: true,
    enum: ['chunked', 'compress', 'deflate', 'gzip', 'identity'],
    /**
     * @returns {string}
     */
    generate: () => {
      const picks = HeadersSchema['transfer-encoding'].enum;
      return chance.pickone(picks);
    },
  },
  link: {
    group: 'general',
    request: false,
    response: true,
    /**
     * @returns {string}
     */
    generate: () => {
      const size = chance.integer({ min: 1, max: 4 });
      return new Array(size).fill(0).map(() => `<${chance.url()}>; rel="${chance.word()}"`).join(', ');
    },
  },
};

export class HeadersGenerator {
  static generateContentType() {
    return HeadersSchema["content-type"].generate();
  }

  /**
   * Generates a list of request or response headers
   * @param {string} type Either `request` or `response`
   * @param {string=} ct A content type to add.
   */
  static generateHeaders(type, ct) {
    const addContentType = !!ct;
    const size = chance.integer({
      min: 0,
      max: 10,
    });
    const names = Object.keys(HeadersSchema).filter((name) => HeadersSchema[name][type]);
    if (addContentType && names.includes('content-type')) {
      const index = names.indexOf('content-type');
      names.splice(index, 1);
    }
    let result = new Array(size).fill(0).map(() => {
      if (names.length === 0) {
        return undefined;
      }
      const name = chance.pickone(names);
      const value = HeadersSchema[name].generate(type);
      return `${name}: ${value}`;
    }).filter((i) => !!i).join('\n');
    if (addContentType) {
      if (result) {
        result += `\n`;
      }
      result += `content-type: ${ct}`;
    }
    return result;
  }

  /**
   * @returns {string} A value for the `location` header
   */
  static generateLink() {
    return HeadersSchema.link.generate();
  }
}