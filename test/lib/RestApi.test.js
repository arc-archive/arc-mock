import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { RestApi } from '../../index.js';

describe('RestApi', () => {
  describe('generateApiIndex()', () => {
    /** @type RestApi */
    let apis;

    before(() => { apis = new RestApi(); });

    it('returns an object', () => {
      const result = apis.apiIndex();
      assert.typeOf(result, 'object');
    });

    [
      ['_id', 'string'],
      ['order', 'number'],
      ['title', 'string'],
      ['type', 'string'],
      ['latest', 'string'],
      ['versions', 'array']
    ].forEach(([property, type]) => {
      it(`has the ${property} property of a type ${type}`, () => {
        const result = apis.apiIndex();
        assert.typeOf(result[property], type);
      });
    });

    it('generate versionsSize versions', () => {
      const result = apis.apiIndex({
        versionSize: 10,
      });
      assert.lengthOf(result.versions, 10);
    });
  });

  describe('generateApiIndexList()', () => {
    /** @type RestApi */
    let apis;

    before(() => { apis = new RestApi(); });

    it('returns an array', () => {
      const result = apis.apiIndexList();
      assert.typeOf(result, 'array');
    });

    it('has size items', () => {
      const result = apis.apiIndexList(10);
      assert.lengthOf(result, 10);
    });

    it('calls generateApiIndex() for each item', () => {
      const spy = sinon.spy(apis, 'apiIndex');
      apis.apiIndexList(2);
      assert.equal(spy.callCount, 2);
    });
  });

  describe('apiData()', () => {
    /** @type RestApi */
    let apis;

    before(() => { apis = new RestApi(); });

    it('returns an array', () => {
      const index = apis.apiIndex();
      const result = apis.apiData(index);
      assert.typeOf(result, 'array');
    });

    [
      ['_id', 'string'],
      ['data', 'string'],
      ['version', 'string'],
      ['indexId', 'string']
    ].forEach(([property, type]) => {
      it(`has the ${property} property of a type ${type}`, () => {
        const index = apis.apiIndex();
        const result = apis.apiData(index)[0];
        assert.typeOf(result[property], type);
      });
    });

    it('generates an item for each version', () => {
      const index = apis.apiIndex({
        versionSize: 6
      });
      const result = apis.apiData(index);
      assert.lengthOf(result, 6);
    });
  });

  describe('apiDataList()', () => {
    /** @type RestApi */
    let apis;

    before(() => { apis = new RestApi(); });

    it('returns an array', () => {
      const index = apis.apiIndex();
      const result = apis.apiDataList([index]);
      assert.typeOf(result, 'array');
    });

    [
      ['_id', 'string'],
      ['data', 'string'],
      ['version', 'string'],
      ['indexId', 'string']
    ].forEach(([property, type]) => {
      it(`has the ${property} property of a type ${type}`, () => {
        const index = apis.apiIndex();
        const result = apis.apiDataList([index])[0];
        assert.typeOf(result[property], type);
      });
    });

    it('generates an item for each version', () => {
      const index = apis.apiIndex({
        versionSize: 6,
      });
      const result = apis.apiDataList([index]);
      assert.lengthOf(result, 6);
    });
  });
});
