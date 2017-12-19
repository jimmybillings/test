import { Common } from '../../shared/utilities/common.functions';
import * as CmsActions from './cms.actions';
import { Pojo } from '../../shared/interfaces/common.interface';

export interface State {
  footer: Pojo;
  homeAssets: Pojo;
}

export const initialState: State = {
  footer: null,
  homeAssets: null
};

export function reducer(state: State = initialState, action: CmsActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case CmsActions.LoadFooterSuccess.Type: {
      return { ...Common.clone(state), footer: action.footer };
    }

    case CmsActions.LoadHomeAssetsSuccess.Type: {
      return { ...Common.clone(state), homeAssets: action.homeAssets };
    }

    default: {
      return state;
    }

  }
}
