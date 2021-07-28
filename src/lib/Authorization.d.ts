import { ARCAuthData } from '@advanced-rest-client/arc-types/src/models/AuthData';
import { DataMockInit, Internet, Types } from '@pawel-up/data-mock';

/** @typedef {import('@pawel-up/data-mock/types').DataMockInit} DataMockInit */
/** @typedef {import('@advanced-rest-client/arc-types').AuthData.ARCAuthData} ARCAuthData */

export declare class Authorization {
  types: Types;
  internet: Internet;
  constructor(init?: DataMockInit);

  /**
   * Generates random Basic authorization object.
   */
  basic(): ARCAuthData;

  /**
   * Generates basic authorization data
   *
   * @param size Number of items to generate. Default to 25.
   * @returns List of datastore entries.
   */
  basicList(size?: number): ARCAuthData[];
}
