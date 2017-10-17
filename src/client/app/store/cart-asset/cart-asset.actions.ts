import { Action } from '@ngrx/store';
import { Asset, ChildAssetLoadParameters } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(assetUuid: string): Load {
    return new Load(assetUuid);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(activeAsset: Asset): LoadSuccess {
    return new LoadSuccess(activeAsset);
  }

  public loadAfterCartAvailable(loadParameters: ChildAssetLoadParameters): LoadAfterCartAvailable {
    return new LoadAfterCartAvailable(loadParameters);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Cart Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly assetUuid: string) { }
}

export class LoadAfterCartAvailable implements Action {
  public static readonly Type = '[Cart Asset] Load After Cart Available';
  public readonly type = LoadAfterCartAvailable.Type;
  constructor(public readonly loadParameters: ChildAssetLoadParameters) { }
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

export type Any = Load | LoadAfterCartAvailable | LoadSuccess | LoadFailure;
