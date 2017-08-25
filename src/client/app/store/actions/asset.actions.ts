import { Action } from '@ngrx/store';
import { Asset, AssetLoadParameters, CollectionAssetLoadParameters } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';

export class ActionFactory {
  public load(parameters: AssetLoadParameters): Load {
    return new Load(parameters);
  }

  public updateMarkersInUrl(markers: SubclipMarkers, assetId: number) {
    return new UpdateMarkersInUrl(markers, assetId);
  }

  public loadCollectionAsset(parameters: CollectionAssetLoadParameters): LoadCollectionAsset {
    return new LoadCollectionAsset(parameters);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(activeAsset: Asset): LoadSuccess {
    return new LoadSuccess(activeAsset);
  }
}

export class Load implements Action {
  public static readonly Type = '[Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly loadParameters: AssetLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class UpdateMarkersInUrl implements Action {
  public static readonly Type = '[Asset] Update Markers In URL';
  public readonly type = UpdateMarkersInUrl.Type;
  constructor(public readonly markers: SubclipMarkers, public readonly assetId: number) {
  }
}

export class LoadCollectionAsset implements Action {
  public static readonly Type = '[Asset] Load Collection Asset';
  public readonly type = LoadCollectionAsset.Type;
  constructor(public readonly loadParameters: CollectionAssetLoadParameters) { }
}

export type Any = Load | LoadSuccess | UpdateMarkersInUrl | LoadCollectionAsset;
