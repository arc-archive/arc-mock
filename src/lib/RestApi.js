import { Lorem, Types, Internet } from '@pawel-up/data-mock';

/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */
/** @typedef {import('@advanced-rest-client/events').RestApi.ARCRestApi} ARCRestApi */
/** @typedef {import('@advanced-rest-client/events').RestApi.ARCRestApiIndex} ARCRestApiIndex */
/** @typedef {import('../../types').RestApiIndexInit} RestApiIndexInit */

export class RestApi {
  /**
   * @param {ArcDataMockInit=} init 
   */
  constructor(init={}) {
    this.types = new Types(init.seed);
    this.lorem = new Lorem(init);
    this.internet = new Internet(init);
  }

  /**
   * @param {RestApiIndexInit=} opts
   * @returns {ARCRestApiIndex}
   */
  apiIndex(opts = {}) {
    const result = /** @type ARCRestApiIndex */ ({
      order: opts.order || 0,
      title: this.lorem.sentence({ words: 2 }),
      type: 'RAML 1.0',
      _id: this.internet.uri(),
    });
    const versionsSize = opts.versionSize ? opts.versionSize : this.types.number({ min: 1, max: 5 });
    const versions = [];
    let last;
    for (let i = 0; i < versionsSize; i++) {
      last = `v${i}`;
      versions[versions.length] = last;
    }
    result.versions = versions;
    result.latest = last;
    return result;
  }

  /**
   * @param {number=} size
   * @param {RestApiIndexInit=} opts
   * @returns {ARCRestApiIndex[]}
   */
  apiIndexList(size=25, opts = {}) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.apiIndex({ ...opts, order: i }));
    }
    return result;
  }

  /**
   * @param {ARCRestApiIndex} index
   * @returns {ARCRestApi[]}
   */
  apiData(index) {
    /** @type ARCRestApi[] */
    const result = [];
    index.versions.forEach((version) => {
      const item = /** @type ARCRestApi */ ({
        data: '[{}]',
        indexId: index._id,
        version,
        _id: `${index._id}|${version}`,
      });
      result[result.length] = item;
    });
    return result;
  }

  /**
   * @param {ARCRestApiIndex[]} indexes
   * @returns {ARCRestApi[]}
   */
  apiDataList(indexes) {
    const size = indexes.length;
    /** @type ARCRestApi[] */
    let result = [];
    for (let i = 0; i < size; i++) {
      const data = this.apiData(indexes[i]);
      result = result.concat(data);
    }
    return result;
  }
}
