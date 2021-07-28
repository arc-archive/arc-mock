import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { HostRules } from '../../index.js';

describe('HostRules', () => {
  describe('rule()', () => {
    /** @type HostRules */
    let rules;

    before(() => { rules = new HostRules(); });

    it('returns an object', () => {
      const result = rules.rule();
      assert.typeOf(result, 'object');
    });

    [
      ['_id', 'string'],
      ['from', 'String'],
      ['to', 'string'],
      ['enabled', 'boolean'],
      ['comment', 'string']
    ].forEach((item) => {
      it(`Has ${item[0]} property of a type ${item[1]}`, () => {
        const result = rules.rule();
        assert.typeOf(result[item[0]], item[1]);
      });
    });
  });

  describe('rules()', () => {
    /** @type HostRules */
    let rules;

    before(() => { rules = new HostRules(); });

    it('returns an array', () => {
      const result = rules.rules();
      assert.typeOf(result, 'array');
    });

    it('has the default number of rules', () => {
      const result = rules.rules();
      assert.lengthOf(result, 25);
    });

    it('has requested number of items', () => {
      const result = rules.rules(5);
      assert.lengthOf(result, 5);
    });

    it('calls rule()', () => {
      const spy = sinon.spy(rules, 'rule');
      rules.rules(5);
      assert.equal(spy.callCount, 5);
    });
  });
});
