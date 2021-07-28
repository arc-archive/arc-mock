import { ARCVariable } from '@advanced-rest-client/arc-types/src/models/Variable';
import { Lorem, Types } from '@pawel-up/data-mock';
import { DataMockInit } from '@pawel-up/data-mock/types';
import { VariableInit } from '../../types';

export declare class Variables {
  types: Types;
  lorem: Lorem;
  
  constructor(init?: DataMockInit);

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
