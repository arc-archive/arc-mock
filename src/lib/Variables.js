import { Lorem, Types } from '@pawel-up/data-mock';

/** @typedef {import('@pawel-up/data-mock/types').DataMockInit} DataMockInit */
/** @typedef {import('@advanced-rest-client/arc-types').Variable.ARCVariable} ARCVariable */
/** @typedef {import('@advanced-rest-client/arc-types').Variable.ARCEnvironment} ARCEnvironment */
/** @typedef {import('../../types').VariableInit} VariableInit */


export class Variables {
  /**
   * @param {DataMockInit=} init 
   */
  constructor(init={}) {
    this.types = new Types(init.seed);
    this.lorem = new Lorem(init);
  }

  /**
   * Generates a random variable
   * @param {VariableInit=} init 
   * @returns {ARCVariable}
   */
  variable(init={}) {
    let isDefault;
    if (init.defaultEnv) {
      isDefault = true;
    } else if (init.randomEnv) {
      isDefault = false;
    } else {
      isDefault = this.types.boolean();
    }
    
    const result = /** @type ARCVariable */ ({
      enabled: this.types.boolean({ likelihood: 85 }),
      value: this.lorem.sentence({ words: 2 }),
      name: this.lorem.word(),
      _id: this.types.uuid(),
      environment: '',
    });
    if (isDefault) {
      result.environment = 'default';
    } else {
      result.environment = this.lorem.sentence({ words: 2 });
    }
    return result;
  }

  /**
   * Generates a number of variables.
   * @param {number=} size The number of variables to generate.
   * @param {VariableInit=} init 
   * @returns {ARCVariable[]}
   */
  listVariables(size = 25, init={}) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(this.variable(init));
    }
    return result;
  }
}
