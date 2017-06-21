import { Action } from '@ngrx/store';

import { Collection, CollectionItemMarkersUpdater, CollectionItemsResponse } from '../interfaces/collection.interface';
import { Asset } from '../interfaces/common.interface';

export const UPDATE_SUMMARY = '[Active Collection] Update';
export const UPDATE_ASSETS = '[Active Collection] Update Assets';
export const RESET = '[Active Collection] Reset';
export const ADD_ASSET = '[Active Collection] Add Asset';
export const REMOVE_ASSET = '[Active Collection] Remove Asset';
export const UPDATE_ASSET_MARKERS = '[Active Collection] Update Asset Markers';

export class UpdateSummary implements Action {
  readonly type = UPDATE_SUMMARY;
  constructor(public payload: Collection) { }
}

export class UpdateAssets implements Action {
  readonly type = UPDATE_ASSETS;
  constructor(public payload: CollectionItemsResponse) { }
}

export class Reset implements Action {
  readonly type = RESET;
}

export class AddAsset implements Action {
  readonly type = ADD_ASSET;
  constructor(public payload: Asset) { }
}

export class RemoveAsset implements Action {
  readonly type = REMOVE_ASSET;
  constructor(public payload: Asset) { }
}

export class UpdateAssetMarkers implements Action {
  readonly type = UPDATE_ASSET_MARKERS;
  constructor(public payload: CollectionItemMarkersUpdater) { }
}

export type All = UpdateSummary | UpdateAssets | Reset | AddAsset | RemoveAsset | UpdateAssetMarkers;
