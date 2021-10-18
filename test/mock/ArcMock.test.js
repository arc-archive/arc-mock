import { assert } from '@open-wc/testing';
import { ArcMock } from '../../index.js';

/** @typedef {import('@advanced-rest-client/events').Cookies.ARCCookie} ARCCookie */

describe('ArcMock', () => {
  describe('constructor()', () => {
    /** @type ArcMock */
    let mock;

    before(() => { mock = new ArcMock(); });

    [
      'http', 'variables', 'cookies', 'hostRules',
      'certificates', 'urls', 'authorization', 'restApi',
    ].forEach((prop) => {
      it(`creates the ${prop} property`, () => {
        assert.ok(mock[prop]);
      });
    });
  });
});
