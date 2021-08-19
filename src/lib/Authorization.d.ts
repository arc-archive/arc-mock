import { ARCAuthData } from '@advanced-rest-client/arc-types/src/models/AuthData';
import { Internet, Types } from '@pawel-up/data-mock';
import { ArcDataMockInit } from '../../types';


export declare class Authorization {
  types: Types;
  internet: Internet;
  constructor(init?: ArcDataMockInit);

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
