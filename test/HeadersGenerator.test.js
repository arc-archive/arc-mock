import { assert } from '@open-wc/testing';
import { HeadersGenerator, HeadersSchema } from '../index.js';

describe('HeadersGenerator', () => {
  describe('HeadersGenerator class', () => {
    describe('generateContentType()', () => {
      it('returns a string', () => {
        const result = HeadersGenerator.generateContentType();
        assert.typeOf(result, 'string');
      });
    });

    describe('generateLink()', () => {
      it('returns a string', () => {
        const result = HeadersGenerator.generateLink();
        assert.typeOf(result, 'string');
      });
    });

    describe('generateHeaders()', () => {
      it('returns a string', () => {
        const result = HeadersGenerator.generateHeaders('request');
        assert.typeOf(result, 'string');
      });

      it('adds the content type', () => {
        const result = HeadersGenerator.generateHeaders('request', 'application/lest');
        assert.include(result, 'content-type: application/lest');
      });
    });
  });

  describe('HeadersSchema', () => {
    
    [
      'date', 'cache-control', 'connection', 'if-match', 'if-none-match',
      'if-modified-since', 'accept', 'accept-charset', 'accept-encoding', 'cookie', 'origin',
      'content-length', 'content-type', 'content-encoding',
    ].forEach((key) => {
      it(`returns a string for ${key} request header`, () => {
        const result = HeadersSchema[key].generate('request');
        assert.typeOf(result, 'string');
      });
    });

    [
      'link', 'transfer-encoding', 'content-encoding', 'content-type', 'content-length',
      'access-control-allow-origin', 'set-cookie', 'etag', 'last-modified', 'pragma', 'expires',
      'age', 'connection', 'cache-control', 'date',
    ].forEach((key) => {
      it(`returns a string for ${key} response header`, () => {
        const result = HeadersSchema[key].generate('response');
        assert.typeOf(result, 'string');
      });
    });
  });
});