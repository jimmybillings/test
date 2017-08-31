import { Action } from '@ngrx/store';

import { Cart } from '../../shared/interfaces/commerce.interface';
import { AssetLoadParameters } from '../../shared/interfaces/common.interface';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(): Load {
    return new Load();
  }

  public loadAsset(loadParameters: AssetLoadParameters): LoadAsset {
    return new LoadAsset(loadParameters);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(cart: Cart): LoadSuccess {
    return new LoadSuccess(cart);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Cart] Load';
  public readonly type = Load.Type;
}

export class LoadAsset implements Action {
  public static readonly Type = '[Cart] Load Asset';
  public readonly type = LoadAsset.Type;
  constructor(public readonly loadParameters: AssetLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Cart] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly cart: Cart) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Cart] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadAsset | LoadSuccess | LoadFailure;
