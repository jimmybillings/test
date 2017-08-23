import { Action } from '@ngrx/store';
import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';

export class ActionFactory {
  public load(parameters: AssetLoadParameters): Load {
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

export type Any = Load | LoadSuccess | UpdateMarkersInUrl;
