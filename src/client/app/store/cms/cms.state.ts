import * as CmsActions from './cms.actions';

export interface State { }

export const initialState: State = {};

export function reducer(state: State = initialState, action: CmsActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case CmsActions.LoadFooterSuccess.Type: {
      console.log(action.footer);
      return state;
    }
    default: {
      return state;
    }

  }
}
