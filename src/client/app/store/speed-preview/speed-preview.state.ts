import * as SpeedPreviewActions from './speed-preview.actions';
import { Asset } from '../../shared/interfaces/common.interface';
import { SpeedviewData } from '../../shared/interfaces/asset.interface';

export interface State {
  readonly [index: number]: SpeedviewData;
  readonly loadingAssetId?: number;
};

export const initialState: State = {};

export function reducer(state: State = initialState, action: SpeedPreviewActions.Any): State {
  if (state === null) state = initialState;
  switch (action.type) {

    case SpeedPreviewActions.Load.Type: {
      return Object.assign({}, state, { loadingAssetId: action.asset.assetId });
    }

    case SpeedPreviewActions.LoadSuccess.Type: {
      return Object.assign({}, state, { [state.loadingAssetId]: action.speedViewData, loadingAssetId: undefined });
    }

    case SpeedPreviewActions.LoadFailure.Type: {
      return Object.assign({}, state, { [state.loadingAssetId]: { noData: true }, loadingAssetId: undefined });
    }

    default: {
      return state;
    }
  }
}

