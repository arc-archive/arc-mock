import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { Urls } from '../../index.js';

/** @typedef {import('@advanced-rest-client/events').Cookies.ARCCookie} ARCCookie */

describe('Urls', () => {
  describe('url()', () => {
    /** @type Urls */
    let urls;

    before(() => { urls = new Urls(); });

    it('returns an object', () => {
      const result = urls.url();
      assert.typeOf(result, 'object');
    });

    [
      ['time', 'number'],
      ['cnt', 'number'],
      ['_id', 'string']
    ].forEach((item) => {
      it(`has the ${item[0]} property of a type ${item[1]}`, () => {
        const result = urls.url();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('urls()', () => {
    /** @type Urls */
    let urls;

    before(() => { urls = new Urls(); });

    it('returns an array', () => {
      const result = urls.urls();
      assert.typeOf(result, 'array');
    });

    it('returns the default number of items', () => {
      const result = urls.urls();
      assert.lengthOf(result, 25);
    });

    it('returns requested number of items', () => {
      const result = urls.urls(5);
      assert.lengthOf(result, 5);
    });

    it('calls url()', () => {
      const spy = sinon.spy(urls, 'url');
      urls.urls(5);
      assert.equal(spy.callCount, 5);
    });
  });
});
