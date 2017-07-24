import { Action } from '@ngrx/store';

import {
  CollectionPaginationParameters, Collection, CollectionItems, CollectionItemMarkersUpdater, CollectionItemsResponse
} from '../../shared/interfaces/collection.interface';
import { Asset } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers.interface';

const defaultPaginationParameters: CollectionPaginationParameters = { currentPage: 1, pageSize: 100 };

export class ActionFactory {
  public load(parameters: CollectionPaginationParameters = defaultPaginationParameters): Load {
    return new Load(parameters);
  }

  public set(collectionId: number, parameters: CollectionPaginationParameters = defaultPaginationParameters): Set {
    return new Set({ collectionId, parameters });
  }

  public loadPage(parameters: CollectionPaginationParameters = defaultPaginationParameters): LoadPage {
    return new LoadPage(parameters);
  }

  public addAsset(asset: Asset, markers?: SubclipMarkers): AddAsset {
    return new AddAsset({ asset, markers });
  }

  public removeAsset(asset: Asset): RemoveAsset {
    return new RemoveAsset(asset);
  }

  public updateAssetMarkers(asset: Asset, markers: SubclipMarkers): UpdateAssetMarkers {
    return new UpdateAssetMarkers({ asset, markers });
  }

  public reset(): Reset {
    return new Reset();
  }
};

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(collection: Collection): LoadSuccess {
    return new LoadSuccess(collection);
  }

  public setSuccess(collection: Collection): SetSuccess {
    return new SetSuccess(collection);
  }

  public loadPageSuccess(assets: CollectionItems): LoadPageSuccess {
    return new LoadPageSuccess(assets);
  }

  public addAssetSuccess(assets: CollectionItems): AddAssetSuccess {
    return new AddAssetSuccess(assets);
  }

  public removeAssetSuccess(assets: CollectionItems): RemoveAssetSuccess {
    return new RemoveAssetSuccess(assets);
  }

  public updateAssetMarkersSuccess(assets: CollectionItems): UpdateAssetMarkersSuccess {
    return new UpdateAssetMarkersSuccess(assets);
  }
};

export class Load implements Action {
  public static readonly Type = '[Active Collection] Load';
  public readonly type = Load.Type;
  constructor(public readonly payload: CollectionPaginationParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Active Collection] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly payload: Collection) { }
}

export class Set implements Action {
  public static readonly Type = '[Active Collection] Set';
  public readonly type = Set.Type;
  constructor(public readonly payload: { readonly collectionId: number, readonly parameters: CollectionPaginationParameters }) { }
}

export class SetSuccess implements Action {
  public static readonly Type = '[Active Collection] Set Success';
  public readonly type = SetSuccess.Type;
  constructor(public readonly payload: Collection) { }
}

export class LoadPage implements Action {
  public static readonly Type = '[Active Collection] Load Page';
  public readonly type = LoadPage.Type;
  constructor(public readonly payload: CollectionPaginationParameters) { }
}

export class LoadPageSuccess implements Action {
  public static readonly Type = '[Active Collection] Load Page Success';
  public readonly type = LoadPageSuccess.Type;
  constructor(public readonly payload: CollectionItems) { }
}

export class AddAsset implements Action {
  public static readonly Type = '[Active Collection] Add Asset';
  public readonly type = AddAsset.Type;
  constructor(public readonly payload: { readonly asset: Asset, readonly markers: SubclipMarkers }) { }
}

export class AddAssetSuccess implements Action {
  public static readonly Type = '[Active Collection] Add Asset Success';
  public readonly type = AddAssetSuccess.Type;
  constructor(public readonly payload: CollectionItems) { }
}

export class RemoveAsset implements Action {
  public static readonly Type = '[Active Collection] Remove Asset';
  public readonly type = RemoveAsset.Type;
  constructor(public readonly payload: Asset) { }
}

export class RemoveAssetSuccess implements Action {
  public static readonly Type = '[Active Collection] Remove Asset Success';
  public readonly type = RemoveAssetSuccess.Type;
  constructor(public readonly payload: CollectionItems) { }
}

export class UpdateAssetMarkers implements Action {
  public static readonly Type = '[Active Collection] Update Asset Markers';
  public readonly type = UpdateAssetMarkers.Type;
  constructor(public readonly payload: { readonly asset: Asset, readonly markers: SubclipMarkers }) { }
}

export class UpdateAssetMarkersSuccess implements Action {
  public static readonly Type = '[Active Collection] Update Asset Markers Success';
  public readonly type = UpdateAssetMarkersSuccess.Type;
  constructor(public readonly payload: CollectionItems) { }
}

export class Reset implements Action {
  public static readonly Type = '[Active Collection] Reset';
  public readonly type = Reset.Type;
}

export type Any = Load | LoadSuccess | Set | SetSuccess | LoadPage | LoadPageSuccess | AddAsset | AddAssetSuccess | RemoveAsset
  | RemoveAssetSuccess | UpdateAssetMarkers | UpdateAssetMarkersSuccess | Reset;
