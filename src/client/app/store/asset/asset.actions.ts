import { Action } from '@ngrx/store';
import * as Common from '../../shared/interfaces/common.interface';
import * as Commerce from '../../shared/interfaces/commerce.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';
import { AssetType } from '../../shared/interfaces/enhanced-asset';

export class ActionFactory {
  public loadOrderAsset(orderId: number, assetUuid: string): LoadOrderAsset {
    return new LoadOrderAsset(orderId, assetUuid, 'orderAsset');
  }

  public loadAssetAfterOrderAvailable(loadParameters: Common.ChildAssetLoadParameters): LoadAssetAfterOrderAvailable {
    return new LoadAssetAfterOrderAvailable(loadParameters);
  }

  public loadQuoteShowAsset(quoteId: number, assetUuid: string): LoadQuoteShowAsset {
    return new LoadQuoteShowAsset(quoteId, assetUuid, 'quoteShowAsset');
  }

  public loadAfterQuoteAvailable(loadParameters: Common.ChildAssetLoadParameters): LoadAssetAfterQuoteAvailable {
    return new LoadAssetAfterQuoteAvailable(loadParameters);
  }

  public loadQuoteEditAsset(assetUuid: string): LoadQuoteEditAsset {
    return new LoadQuoteEditAsset(assetUuid, 'quoteEditAsset');
  }

  public loadAssetAfterQuoteAvailable(loadParameters: Common.ChildAssetLoadParameters): LoadAssetAfterQuoteAvailable {
    return new LoadAssetAfterQuoteAvailable(loadParameters);
  }

  public loadCartAsset(assetUuid: string): LoadCartAsset {
    return new LoadCartAsset(assetUuid, 'cartAsset');
  }

  public loadAssetAfterCartAvailable(loadParameters: Common.ChildAssetLoadParameters): LoadAssetAfterCartAvailable {
    return new LoadAssetAfterCartAvailable(loadParameters);
  }

  public loadActiveCollectionAsset(assetUuid: string): LoadActiveCollectionAsset {
    return new LoadActiveCollectionAsset(assetUuid, 'collectionAsset');
  }

  public loadAssetAfterCollectionAvailable(params: Common.ChildAssetLoadParameters): LoadAssetAfterCollectionAvailable {
    return new LoadAssetAfterCollectionAvailable(params);
  }

  public loadSearchAsset(params: Common.SearchAssetLoadParameters): LoadSearchAsset {
    return new LoadSearchAsset(params, 'searchAsset');
  }

  public updateMarkersInUrl(markers: SubclipMarkers, assetId: number) {
    return new UpdateMarkersInUrl(markers, assetId);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(activeAsset: Common.Asset | Commerce.Asset): LoadSuccess {
    return new LoadSuccess(activeAsset);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }
}

export class LoadOrderAsset implements Action {
  public static readonly Type = '[Asset] Load Order Asset';
  public readonly type = LoadOrderAsset.Type;
  constructor(public readonly orderId: number, public readonly uuid: string, public readonly assetType: AssetType) { }
}

export class LoadAssetAfterOrderAvailable implements Action {
  public static readonly Type = '[Asset] Load Asset After Order Available';
  public readonly type = LoadAssetAfterOrderAvailable.Type;
  constructor(public readonly loadParameters: Common.ChildAssetLoadParameters) { }
}

export class LoadQuoteShowAsset implements Action {
  public static readonly Type = '[Asset] Load Quote Show Asset';
  public readonly type = LoadQuoteShowAsset.Type;
  constructor(public readonly quoteId: number, public readonly uuid: string, public readonly assetType: AssetType) { }
}

export class LoadSearchAsset implements Action {
  public static readonly Type = '[Asset] Load Search Asset';
  public readonly type = LoadSearchAsset.Type;
  constructor(public readonly loadParameters: Common.SearchAssetLoadParameters, public readonly assetType: AssetType) { }
}

export class LoadCartAsset implements Action {
  public static readonly Type = '[Asset] Load Cart Asset';
  public readonly type = LoadCartAsset.Type;
  constructor(public readonly uuid: string, public readonly assetType: AssetType) { }
}

export class LoadAssetAfterCartAvailable implements Action {
  public static readonly Type = '[Asset] Load Asset After Cart Available';
  public readonly type = LoadAssetAfterCartAvailable.Type;
  constructor(public readonly loadParameters: Common.ChildAssetLoadParameters) { }
}

export class LoadActiveCollectionAsset implements Action {
  public static readonly Type = '[Asset] Load Active Collection Asset';
  public readonly type = LoadActiveCollectionAsset.Type;
  constructor(public readonly uuid: string, public readonly assetType: AssetType) { }
}

export class LoadAssetAfterCollectionAvailable implements Action {
  public static readonly Type = '[Asset] Load Asset After Collection Available';
  public readonly type = LoadAssetAfterCollectionAvailable.Type;
  constructor(public readonly loadParameters: Common.ChildAssetLoadParameters) { }
}

export class LoadQuoteEditAsset implements Action {
  public static readonly Type = '[Asset] Load Quote Edit Asset';
  public readonly type = LoadQuoteEditAsset.Type;
  constructor(public readonly uuid: string, public readonly assetType: AssetType) { }
}

export class LoadAssetAfterQuoteAvailable implements Action {
  public static readonly Type = '[Asset] Load Asset After Quote Available';
  public readonly type = LoadAssetAfterQuoteAvailable.Type;
  constructor(public readonly loadParameters: Common.ChildAssetLoadParameters) { }
}

export class UpdateMarkersInUrl implements Action {
  public static readonly Type = '[Asset] Update Markers In URL';
  public readonly type = UpdateMarkersInUrl.Type;
  constructor(public readonly markers: SubclipMarkers, public readonly assetId: number) { }
}
export class LoadSuccess implements Action {
  public static readonly Type = '[Asset] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeAsset: Common.Asset | Commerce.Asset) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Asset] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = LoadCartAsset | LoadOrderAsset | LoadQuoteEditAsset | LoadSearchAsset | LoadQuoteShowAsset |
  LoadActiveCollectionAsset | LoadSuccess | LoadFailure;
