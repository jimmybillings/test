import { Action } from '@ngrx/store';

import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';

export const LOAD = '[Asset] Load';
export const LOAD_SUCCESS = '[Asset] Load Success';

export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: AssetLoadParameters) { }
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: Asset) { }
}

export type All = Load | LoadSuccess;
