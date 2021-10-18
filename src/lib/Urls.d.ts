import { ARCUrlHistory } from '@advanced-rest-client/events/src/models/UrlHistory';
import { Internet, Types, Time } from '@pawel-up/data-mock';
import { ArcDataMockInit } from '../../types';

export declare class Urls {
  types: Types;
  internet: Internet;
  time: Time;
  
  constructor(init?: ArcDataMockInit);

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
