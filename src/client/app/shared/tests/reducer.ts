import { ActionReducer } from '@ngrx/store';

export function addStandardReducerTestsFor(reducer: ActionReducer<any>, actionType: string, options: any = {}) {
  const initialState: any = options.initialState || { some: 'state' };
  const payload: any = options.payload || { some: 'payload' };

  describe('Standard reducer tests', () => {
    it('does not fail with a null current state', () => {
      expect(reducer.bind(this, null, { type: actionType, payload: payload })).not.toThrow();
    });

    it('does not alter the current state', () => {
      const currentState = JSON.parse(JSON.stringify(initialState));

      reducer(currentState, { type: actionType, payload: payload });

      expect(currentState).toEqual(initialState);
    });
  });
}
