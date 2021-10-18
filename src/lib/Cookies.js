import { Lorem, Types, Internet } from '@pawel-up/data-mock';

/** @typedef {import('@advanced-rest-client/events').Cookies.ARCCookie} ARCCookie */
/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */

export class Cookies {
  /**
   * @param {ArcDataMockInit=} init 
   */
  constructor(init={}) {
    this.types = new Types(init.seed);
    this.lorem = new Lorem(init);
    this.internet = new Internet(init);
  }

  /**
   * Generates random Cookie data
   * @returns {ARCCookie}
   */
  cookie() {
    const time = this.types.datetime().getTime();
    const result = {
      created: time,
      updated: time,
      expires: this.types.datetime().getTime(),
      maxAge: this.types.number({ min: 100, max: 1000 }),
      name: this.lorem.word(),
      value: this.lorem.word(),
      _id: this.types.uuid(),
      domain: this.internet.domain(),
      hostOnly: this.types.boolean(),
      httpOnly: this.types.boolean(),
      lastAccess: time,
      path: this.types.boolean() ? '/' : `/${this.lorem.word()}`,
      persistent: this.types.boolean(),
    };
    return result;
  }

  /**
   * Generates a list of cookies
   * 
   * @return {ARCCookie[]} List of datastore entries.
   */
  cookies(size = 25) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.cookie());
    }
    return result;
  }
}
