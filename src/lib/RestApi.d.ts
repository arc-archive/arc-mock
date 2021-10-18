import { ARCRestApi, ARCRestApiIndex } from '@advanced-rest-client/events/src/models/RestApi';
import { Lorem, Types, Internet } from '@pawel-up/data-mock';
import { ArcDataMockInit, RestApiIndexInit } from '../../types';

export declare class RestApi {
  types: Types;
  lorem: Lorem;
  internet: Internet;
  constructor(init?: ArcDataMockInit);
  apiIndex(opts?: RestApiIndexInit): ARCRestApiIndex;
  apiIndexList(size?: number, opts?: RestApiIndexInit): ARCRestApiIndex[];
  apiData(index: ARCRestApiIndex): ARCRestApi[];
  apiDataList(indexes?: ARCRestApiIndex[]): ARCRestApi[];
}
