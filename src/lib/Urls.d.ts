import { ARCUrlHistory } from '@advanced-rest-client/arc-types/src/models/UrlHistory';
import { Internet, Types, Time, DataMockInit } from '@pawel-up/data-mock';

/** @typedef {import('@pawel-up/data-mock/types').DataMockInit} DataMockInit */
/** @typedef {import('@advanced-rest-client/arc-types').UrlHistory.ARCUrlHistory} ARCUrlHistory */

export declare class Urls {
  types: Types;
  internet: Internet;
  time: Time;
  
  constructor(init?: DataMockInit);

  /**
   * Generates a single ARC URL model item.
   */
  url(): ARCUrlHistory;

  /**
   * Generates list of ARC URL models.
   *
   * @returns List of datastore entries.
   */
  urls(size?: number): ARCUrlHistory[];
}
