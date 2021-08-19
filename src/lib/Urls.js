import { Internet, Types, Time } from '@pawel-up/data-mock';

/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */
/** @typedef {import('@advanced-rest-client/arc-types').UrlHistory.ARCUrlHistory} ARCUrlHistory */

export class Urls {
  /**
   * @param {ArcDataMockInit=} init 
   */
  constructor(init={}) {
    this.types = new Types(init.seed);
    this.internet = new Internet(init);
    this.time = new Time(init);
  }

  /**
   * Generates a single ARC URL model item.
   * @return {ARCUrlHistory}
   */
  url() {
    const url = this.internet.uri();
    const time = this.types.datetime().getTime();
    const result = /** @type ARCUrlHistory */ ({
      time,
      cnt: this.types.number({ min: 100, max: 1000 }),
      _id: url,
      url,
      midnight: this.time.midnight(time),
    });
    return result;
  }

  /**
   * Generates list of ARC URL models.
   *
   * @param {number=} size
   * @return {ARCUrlHistory[]} List of datastore entries.
   */
  urls(size = 25) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.url());
    }
    return result;
  }
}
