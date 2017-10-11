import * as LoadingIndicatorActions from './loading-indicator.actions';

export interface State {
  show: boolean;
}

export const initialState: State = {
  show: false
};

export function reducer(state: State = initialState, action: LoadingIndicatorActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {

    case LoadingIndicatorActions.Show.Type: {
      return { ...state, show: true };
    }

    case LoadingIndicatorActions.Hide.Type: {
      return { ...state, show: false };
    }

    default: {
      return state;
    }

  }
}
