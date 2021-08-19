import { ARCCookie } from '@advanced-rest-client/arc-types/src/cookies/Cookies';
import { Lorem, Types, Internet } from '@pawel-up/data-mock';
import { ArcDataMockInit } from '../../types';

export declare class Cookies {
  types: Types;
  lorem: Lorem;
  internet: Internet;
  constructor(init?: ArcDataMockInit);

  /**
   * Generates random Cookie data
   */
  cookie(): ARCCookie;

  /**
   * Generates a list of cookies
   * 
   * @return List of datastore entries.
   */
  cookies(size?: number): ARCCookie[];
}
