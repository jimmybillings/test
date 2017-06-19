import { Action } from '@ngrx/store';

import { Asset } from '../interfaces/common.interface';
import * as AssetActions from '../actions/asset.actions';

export interface State {
  currentAsset: Asset;
  loaded: boolean;
};

export const initialState: State = {
  currentAsset: { assetId: 0, name: '' },
  loaded: false
};

export function reducer(state: State = initialState, action: AssetActions.All): State {
  switch (action.type) {
    case AssetActions.LOAD: {
      return JSON.parse(JSON.stringify(initialState));
    }

    case AssetActions.LOAD_SUCCESS: {
      return { currentAsset: action.payload, loaded: true };
    }

    default: {
      return state;
    }
  }
}
