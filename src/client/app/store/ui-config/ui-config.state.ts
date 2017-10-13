import * as UiConfigActions from './ui-config.actions';
import { Common } from '../../shared/interfaces/common.interface';

export interface UiConfigSegment {
  loaded: boolean;
  config: {
    [index: string]: any;
  };
};

export interface State extends Common {
  loaded: boolean;
  components: {
    'cart': UiConfigSegment;
    'billing': UiConfigSegment;
    'global': UiConfigSegment;
    'header': UiConfigSegment;
    'footer': UiConfigSegment;
    'searchBox': UiConfigSegment;
    'search': UiConfigSegment;
    'home': UiConfigSegment;
    'userBasicInfo': UiConfigSegment;
    'register': UiConfigSegment;
    'login': UiConfigSegment;
    'forgotPassword': UiConfigSegment;
    'resetPassword': UiConfigSegment;
    'changePassword': UiConfigSegment;
    'collection': UiConfigSegment;
    'assetSharing': UiConfigSegment;
    'cartComment': UiConfigSegment;
    'collectionComment': UiConfigSegment;
    'quoteComment': UiConfigSegment;
    [index: string]: UiConfigSegment;
  };
};

export const initialState: State = { loaded: false, components: null };

export function reducer(state: State = initialState, action: UiConfigActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {

    case UiConfigActions.InitializeSuccess.Type:
    case UiConfigActions.LoadSuccess.Type: {
      return {
        ...state,
        ...action.config,
        loaded: true
      };
    }

    default: {
      return state;
    }

  }
}
