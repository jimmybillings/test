import { Action } from '@ngrx/store';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { QuoteAssetUrlLoadParameters, Asset } from '../../shared/interfaces/common.interface';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(parameters: QuoteAssetUrlLoadParameters): Load {
    return new Load(parameters);
  }

  public updateMarkersInUrl(markers: SubclipMarkers, assetId: number) {
    return new UpdateMarkersInUrl(markers, assetId);
  }

  public loadAfterQuoteAvailable(loadParameters: QuoteAssetUrlLoadParameters): LoadAfterQuoteAvailable {
    return new LoadAfterQuoteAvailable(loadParameters);
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
  public static readonly Type = '[Quote Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly loadParameters: QuoteAssetUrlLoadParameters) { }
}

export class LoadAfterQuoteAvailable implements Action {
  public static readonly Type = '[Quote Asset] Load After Quote Available';
  public readonly type = LoadAfterQuoteAvailable.Type;
  constructor(public readonly loadParameters: QuoteAssetUrlLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Quote Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Quote Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class UpdateMarkersInUrl implements Action {
  public static readonly Type = '[Quote Asset] Update Markers In URL';
  public readonly type = UpdateMarkersInUrl.Type;
  constructor(public readonly markers: SubclipMarkers, public readonly assetId: number) {
  }
}

export type Any = Load | LoadAfterQuoteAvailable | LoadSuccess | LoadFailure | UpdateMarkersInUrl;
