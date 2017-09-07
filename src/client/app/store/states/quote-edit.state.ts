import * as QuoteEditActions from '../actions/quote-edit.actions';
import { Common } from '../../shared/utilities/common.functions';
import { Quote } from '../../shared/interfaces/commerce.interface';

export interface State {
  data: Quote;
  loading: boolean;
}

export const initialState: State = {
  data: {
    id: 0,
    total: 0,
    createdUserId: 0,
    ownerUserId: 0,
    quoteStatus: 'PENDING'
  },
  loading: false
};

export function reducer(state: State = initialState, action: QuoteEditActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case QuoteEditActions.Load.Type: {
      return {
        ...Common.clone(state),
        loading: true
      };
    }

    case QuoteEditActions.LoadSuccess.Type: {
      return {
        loading: false,
        data: {
          ...action.quote
        }
      };
    }

    case QuoteEditActions.LoadFailure.Type: {
      return {
        ...Common.clone(state),
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}
