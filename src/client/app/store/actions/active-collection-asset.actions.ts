import { Action } from '@ngrx/store';
import { CollectionAssetUrlLoadParameters, Asset } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(parameters: CollectionAssetUrlLoadParameters): Load {
    return new Load(parameters);
  }

  public updateMarkersInUrl(markers: SubclipMarkers, assetId: number) {
    return new UpdateMarkersInUrl(markers, assetId);
  }

  public loadAfterCollectionAvailable(loadParameters: CollectionAssetUrlLoadParameters): LoadAfterCollectionAvailable {
    return new LoadAfterCollectionAvailable(loadParameters);
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
  public static readonly Type = '[Collection Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly loadParameters: CollectionAssetUrlLoadParameters) { }
}

export class LoadAfterCollectionAvailable implements Action {
  public static readonly Type = '[Collection Asset] Load After Collection Available';
  public readonly type = LoadAfterCollectionAvailable.Type;
  constructor(public readonly loadParameters: CollectionAssetUrlLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Collection Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Collection Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class UpdateMarkersInUrl implements Action {
  public static readonly Type = '[Collection Asset] Update Markers In URL';
  public readonly type = UpdateMarkersInUrl.Type;
  constructor(public readonly markers: SubclipMarkers, public readonly assetId: number) {
  }
}

export type Any = LoadAfterCollectionAvailable | Load | LoadSuccess | LoadFailure | UpdateMarkersInUrl;
