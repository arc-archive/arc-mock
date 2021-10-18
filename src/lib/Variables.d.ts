import { ARCVariable } from '@advanced-rest-client/events/src/models/Variable';
import { Lorem, Types } from '@pawel-up/data-mock';
import { ArcDataMockInit, VariableInit } from '../../types';

export declare class Variables {
  types: Types;
  lorem: Lorem;
  
  constructor(init?: ArcDataMockInit);

  /**
   * Generates a random variable
   */
  variable(init?: VariableInit): ARCVariable;

  /**
   * Generates a number of variables.
   * @param size The number of variables to generate.
   */
  listVariables(size?: number, init?: VariableInit): ARCVariable[];
}
