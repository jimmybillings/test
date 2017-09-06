import { Action } from '@ngrx/store';
import { Asset, OrderAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(orderId: number, loadParameters: OrderAssetUrlLoadParameters): Load {
    return new Load(orderId, loadParameters);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadAfterOrderAvailable(loadParameters: OrderAssetUrlLoadParameters): LoadAfterOrderAvailable {
    return new LoadAfterOrderAvailable(loadParameters);
  }

  public loadSuccess(activeAsset: Asset): LoadSuccess {
    return new LoadSuccess(activeAsset);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Order Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly orderId: number, public readonly loadParameters: OrderAssetUrlLoadParameters) { }
}

export class LoadAfterOrderAvailable implements Action {
  public static readonly Type = '[Order Asset] Load After Order Available';
  public readonly type = LoadAfterOrderAvailable.Type;
  constructor(public readonly loadParameters: OrderAssetUrlLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Order Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Order Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadAfterOrderAvailable | LoadSuccess | LoadFailure;
