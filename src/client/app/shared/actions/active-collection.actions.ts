import { Action } from '@ngrx/store';

import { Collection, CollectionItemMarkersUpdater } from '../interfaces/collection.interface';
import { Asset } from '../interfaces/common.interface';

export const UPDATE = '[Active Collection] Update';
export const RESET = '[Active Collection] Reset';
export const ADD_ASSET = '[Active Collection] Add Asset';
export const REMOVE_ASSET = '[Active Collection] Remove Asset';
export const UPDATE_ASSET_MARKERS = '[Active Collection] Update Asset Markers';

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: Collection) { }
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

export class UpdateAsset implements Action {
  readonly type = UPDATE_ASSET_MARKERS;
  constructor(public payload: CollectionItemMarkersUpdater) { }
}

export type All = Update | Reset | AddAsset | RemoveAsset | UpdateAsset;
