import { Action } from '@ngrx/store';
import { Asset, SearchAssetLoadParameters } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(parameters: SearchAssetLoadParameters): Load {
    return new Load(parameters);
  }

  public updateMarkersInUrl(markers: SubclipMarkers, assetId: number) {
    return new UpdateMarkersInUrl(markers, assetId);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(activeAsset: Asset): LoadSuccess {
    return new LoadSuccess(activeAsset);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }

  public setDeliveryOptions(flag: boolean): SetDeliveryOptions {
    return new SetDeliveryOptions(flag);
  }
}

export class Load implements Action {
  public static readonly Type = '[Search Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly loadParameters: SearchAssetLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Search Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Search Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class SetDeliveryOptions implements Action {
  public static readonly Type = '[Search Asset] Set Delivery Options';
  public readonly type = SetDeliveryOptions.Type;
  constructor(public readonly flag: boolean) { }
}

export class UpdateMarkersInUrl implements Action {
  public static readonly Type = '[Search Asset] Update Markers In URL';
  public readonly type = UpdateMarkersInUrl.Type;
  constructor(public readonly markers: SubclipMarkers, public readonly assetId: number) {
  }
}

export type Any = Load | LoadSuccess | LoadFailure | UpdateMarkersInUrl | SetDeliveryOptions;
