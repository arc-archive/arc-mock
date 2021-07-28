import { ARCRestApi, ARCRestApiIndex } from '@advanced-rest-client/arc-types/src/models/RestApi';
import { Lorem, Types, Internet, DataMockInit } from '@pawel-up/data-mock';
import { RestApiIndexInit } from '../../types';

/** @typedef {import('@pawel-up/data-mock/types').DataMockInit} DataMockInit */
/** @typedef {import('@advanced-rest-client/arc-types').RestApi.ARCRestApi} ARCRestApi */
/** @typedef {import('@advanced-rest-client/arc-types').RestApi.ARCRestApiIndex} ARCRestApiIndex */
/** @typedef {import('../../types').RestApiIndexInit} RestApiIndexInit */

export declare class RestApi {
  types: Types;
  lorem: Lorem;
  internet: Internet;
  constructor(init?: DataMockInit);
  apiIndex(opts?: RestApiIndexInit): ARCRestApiIndex;
  apiIndexList(size?: number, opts?: RestApiIndexInit): ARCRestApiIndex[];
  apiData(index: ARCRestApiIndex): ARCRestApi[];
  apiDataList(indexes?: ARCRestApiIndex[]): ARCRestApi[];
}
