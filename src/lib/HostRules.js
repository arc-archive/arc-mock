import { Lorem, Types, Internet } from '@pawel-up/data-mock';

/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */
/** @typedef {import('@advanced-rest-client/events').HostRule.ARCHostRule} ARCHostRule */

export class HostRules {
  /**
   * @param {ArcDataMockInit=} init
   */
  constructor(init = {}) {
    this.types = new Types(init.seed);
    this.lorem = new Lorem(init);
    this.internet = new Internet(init);
  }

  /**
   * Generates random URL data object.
   *
   * @return {ARCHostRule}
   */
  rule() {
    const result = {
      _id: this.types.uuid(),
      from: this.internet.uri(),
      to: this.internet.uri(),
      enabled: this.types.boolean(),
      comment: this.lorem.paragraph(),
    };
    return result;
  }

  /**
   * Generates a list of host rules.
   *
   * @param {number=} [size=25] Number of items to generate. Default to 25.
   * @return {ARCHostRule[]} List of datastore entries.
   */
  rules(size = 25) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.rule());
    }
    return result;
  }
}
