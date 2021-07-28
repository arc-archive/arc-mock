import { ARCHostRule } from '@advanced-rest-client/arc-types/src/models/HostRule';
import { Lorem, Types, Internet } from '@pawel-up/data-mock';
import { DataMockInit } from '@pawel-up/data-mock/types';

/** @typedef {import('@pawel-up/data-mock/types').DataMockInit} DataMockInit */
/** @typedef {import('@advanced-rest-client/arc-types').HostRule.ARCHostRule} ARCHostRule */

export declare class HostRules {
  types: Types;
  lorem: Lorem;
  internet: Internet;
  constructor(init?: DataMockInit);

  /**
   * Generates random URL data object.
   */
  rule(): ARCHostRule;

  /**
   * Generates a list of host rules.
   *
   * @param size Number of items to generate. Default to 25.
   * @return List of datastore entries.
   */
  rules(size?: number): ARCHostRule[];
}
