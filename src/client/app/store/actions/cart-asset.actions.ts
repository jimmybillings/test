import { Action } from '@ngrx/store';
import { Asset, CartAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(parameters: CartAssetUrlLoadParameters): Load {
    return new Load(parameters);
  }

  public updateMarkersInUrl(markers: SubclipMarkers, assetId: number) {
    return new UpdateMarkersInUrl(markers, assetId);
  }

  public loadAfterCartAvailable(loadParameters: CartAssetUrlLoadParameters): LoadAfterCartAvailable {
    return new LoadAfterCartAvailable(loadParameters);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(activeAsset: Asset): LoadSuccess {
    return new LoadSuccess(activeAsset);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Cart Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly loadParameters: CartAssetUrlLoadParameters) { }
}

export class LoadAfterCartAvailable implements Action {
  public static readonly Type = '[Cart Asset] Load After Cart Available';
  public readonly type = LoadAfterCartAvailable.Type;
  constructor(public readonly loadParameters: CartAssetUrlLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Cart Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Cart Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class UpdateMarkersInUrl implements Action {
  public static readonly Type = '[Cart Asset] Update Markers In URL';
  public readonly type = UpdateMarkersInUrl.Type;
  constructor(public readonly markers: SubclipMarkers, public readonly assetId: number) {
  }
}

export type Any = Load | LoadAfterCartAvailable | LoadSuccess | LoadFailure | UpdateMarkersInUrl;
