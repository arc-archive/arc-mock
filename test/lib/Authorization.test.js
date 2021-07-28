import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { Authorization } from '../../index.js';

describe('Authorization', () => {
  describe('basic()', () => {
    /** @type Authorization */
    let auth;

    before(() => { auth = new Authorization(); });

    it('returns an object', () => {
      const result = auth.basic();
      assert.typeOf(result, 'object');
    });

    [
      ['_id', 'string'],
      ['username', 'string'],
      ['password', 'string']
    ].forEach((item) => {
      it(`has the ${item[0]} property of a type ${item[1]}`, () => {
        const result = auth.basic();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('basicList()', () => {
    /** @type Authorization */
    let auth;

    before(() => { auth = new Authorization(); });

    it('returns an array', () => {
      const result = auth.basicList();
      assert.typeOf(result, 'array');
    });

    it('returns the default number of items', () => {
      const result = auth.basicList();
      assert.lengthOf(result, 25);
    });

    it('returns requested number of items', () => {
      const result = auth.basicList(5);
      assert.lengthOf(result, 5);
    });

    it('calls basic() method', () => {
      const spy = sinon.spy(auth, 'basic');
      auth.basicList(5);
      assert.equal(spy.callCount, 5);
    });
  });
});
