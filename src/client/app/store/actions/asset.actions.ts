import { Action } from '@ngrx/store';

import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public load(parameters: AssetLoadParameters): Load {
    return new Load(parameters);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(asset: Asset): LoadSuccess {
    return new LoadSuccess(asset);
  }
}

export class Load implements Action {
  public static readonly Type = '[Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly payload: AssetLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly payload: Asset) { }
}

export type Any = Load | LoadSuccess;
