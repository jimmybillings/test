import { Action } from '@ngrx/store';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { Asset, ChildAssetLoadParameters } from '../../shared/interfaces/common.interface';
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

  public loadAfterQuoteAvailable(loadParameters: ChildAssetLoadParameters): LoadAfterQuoteAvailable {
    return new LoadAfterQuoteAvailable(loadParameters);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Quote Edit Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly assetUuid: string) { }
}

export class LoadAfterQuoteAvailable implements Action {
  public static readonly Type = '[Quote Edit Asset] Load After Quote Available';
  public readonly type = LoadAfterQuoteAvailable.Type;
  constructor(public readonly loadParameters: ChildAssetLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Quote Edit Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Quote Edit Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadAfterQuoteAvailable | LoadSuccess | LoadFailure;
