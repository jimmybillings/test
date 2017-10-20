import { Action } from '@ngrx/store';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';
import { DeliveryOptions } from '../../shared/interfaces/asset.interface';
import { Asset } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public load(asset: Asset): Load {
    return new Load(asset);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(options: DeliveryOptions): LoadSuccess {
    return new LoadSuccess(options);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Delivery Options] Load';
  public readonly type = Load.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Delivery Options] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly options: DeliveryOptions) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Delivery Options] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadSuccess | LoadFailure;
