import * as SnackbarActions from '../actions/snackbar.actions';
import { Poj } from '../../shared/interfaces/common.interface';

export interface State {
  messageKey: string;
  messageParameters: Poj;
  translatedMessage: string;
};

export const initialState = {
  messageKey: '',
  messageParameters: {},
  translatedMessage: ''
};

export function reducer(state: State = initialState, action: SnackbarActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case SnackbarActions.Display.Type: {
      return {
        messageKey: action.payload.messageKey,
        messageParameters: action.payload.messageParameters,
        translatedMessage: ''
      };
    }

    case SnackbarActions.DisplaySuccess.Type: {
      return {
        messageKey: state.messageKey,
        messageParameters: { ...state.messageParameters },
        translatedMessage: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
