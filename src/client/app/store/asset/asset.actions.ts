import { Action } from '@ngrx/store';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';
import { DeliveryOptions } from '../../shared/interfaces/asset.interface';
import { Asset } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public loadDeliveryOptions(asset: Asset): LoadDeliveryOptions {
    return new LoadDeliveryOptions(asset);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadDeliveryOptionsSuccess(options: DeliveryOptions): LoadDeliveryOptionsSuccess {
    return new LoadDeliveryOptionsSuccess(options);
  }

  public loadDeliveryOptionsFailure(error: ApiErrorResponse): LoadDeliveryOptionsFailure {
    return new LoadDeliveryOptionsFailure(error);
  }
}

export class LoadDeliveryOptions implements Action {
  public static readonly Type = '[Asset] Load Delivery Options';
  public readonly type = LoadDeliveryOptions.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadDeliveryOptionsSuccess implements Action {
  public static readonly Type = '[Asset] Load Delivery Options Success';
  public readonly type = LoadDeliveryOptionsSuccess.Type;
  constructor(public readonly options: DeliveryOptions) { }
}

export class LoadDeliveryOptionsFailure implements Action {
  public static readonly Type = '[Asset] Load Delivery Options Failure';
  public readonly type = LoadDeliveryOptionsFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = LoadDeliveryOptions | LoadDeliveryOptionsSuccess | LoadDeliveryOptionsFailure;
