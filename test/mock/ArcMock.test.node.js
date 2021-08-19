import { assert } from 'chai';
import { ArcMock } from '../../index.js';

/** @typedef {import('@advanced-rest-client/arc-types').Cookies.ARCCookie} ARCCookie */

describe('ArcMock', () => {
  describe('constructor()', () => {
    /** @type ArcMock */
    let mock;

    before(() => { mock = new ArcMock(); });

    [
      'http', 'variables', 'cookies', 'hostRules',
      'certificates', 'urls', 'authorization', 'restApi',
      'store',
    ].forEach((prop) => {
      it(`creates the ${prop} property`, () => {
        assert.ok(mock[prop]);
      });
    });
  });
});
