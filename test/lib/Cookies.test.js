import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { Cookies } from '../../index.js';

/** @typedef {import('@advanced-rest-client/arc-types').Cookies.ARCCookie} ARCCookie */

describe('Cookies', () => {
  describe('cookie()', () => {
    /** @type Cookies */
    let cookies;

    before(() => { cookies = new Cookies(); });

    it('returns an object', () => {
      const result = cookies.cookie();
      assert.typeOf(result, 'object');
    });

    [
      ['created', 'number'],
      ['updated', 'number'],
      ['expires', 'number'],
      ['maxAge', 'number'],
      ['name', 'string'],
      ['_id', 'string'],
      ['value', 'string'],
      ['domain', 'string'],
      ['hostOnly', 'boolean'],
      ['httpOnly', 'boolean'],
      ['lastAccess', 'number'],
      ['path', 'string'],
      ['persistent', 'boolean']
    ].forEach((item) => {
      it(`has the ${item[0]} property of a type ${item[1]}`, () => {
        const result = cookies.cookie();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('cookies()', () => {
    /** @type Cookies */
    let cookies;

    before(() => { cookies = new Cookies(); });

    it('returns an array', () => {
      const result = cookies.cookies();
      assert.typeOf(result, 'array');
    });

    it('has default number of requests', () => {
      const result = cookies.cookies();
      assert.lengthOf(result, 25);
    });

    it('has requested number of items', () => {
      const result = cookies.cookies(5);
      assert.lengthOf(result, 5);
    });

    it('calls generateHeaderSetObject()', () => {
      const spy = sinon.spy(cookies, 'cookie');
      cookies.cookies(5);
      assert.equal(spy.callCount, 5);
    });
  });
});
