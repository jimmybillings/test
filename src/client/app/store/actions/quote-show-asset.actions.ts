import { Action } from '@ngrx/store';
import { Asset, QuoteAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';

export class ActionFactory {
  public load(quoteId: number, loadParameters: QuoteAssetUrlLoadParameters): Load {
    return new Load(quoteId, loadParameters);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadAfterQuoteAvailable(loadParameters: QuoteAssetUrlLoadParameters): LoadAfterQuoteAvailable {
    return new LoadAfterQuoteAvailable(loadParameters);
  }

  public loadSuccess(activeAsset: Asset): LoadSuccess {
    return new LoadSuccess(activeAsset);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Quote Show Asset] Load';
  public readonly type = Load.Type;
  constructor(public readonly quoteId: number, public readonly loadParameters: QuoteAssetUrlLoadParameters) { }
}

export class LoadAfterQuoteAvailable implements Action {
  public static readonly Type = '[Quote Show Asset] Load After Quote Available';
  public readonly type = LoadAfterQuoteAvailable.Type;
  constructor(public readonly loadParameters: QuoteAssetUrlLoadParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Quote Show Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Quote Show Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadAfterQuoteAvailable | LoadSuccess | LoadFailure;
