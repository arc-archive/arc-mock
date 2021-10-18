import { Internet, Types } from '@pawel-up/data-mock';

/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */
/** @typedef {import('@advanced-rest-client/events').AuthData.ARCAuthData} ARCAuthData */

export class Authorization {
  /**
   * @param {ArcDataMockInit=} init 
   */
  constructor(init={}) {
    this.types = new Types(init.seed);
    this.internet = new Internet(init);
  }

  /**
   * Generates random Basic authorization object.
   * @return {ARCAuthData}
   */
  basic() {
    const result = /** @type ARCAuthData */ ({
      _id: `basic/${this.types.string()}`,
      username: this.internet.userName(),
      password: this.types.hash(),
    });
    return result;
  }

  /**
   * Generates basic authorization data
   *
   * @param {number=} size Number of items to generate. Default to 25.
   * @return {ARCAuthData[]} List of datastore entries.
   */
  basicList(size = 25) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.basic());
    }
    return result;
  }
}
