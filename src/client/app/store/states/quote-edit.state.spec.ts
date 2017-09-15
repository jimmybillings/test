import * as QuoteEditActions from '../actions/quote-edit.actions';
import * as QuoteState from './quote-edit.state';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Quote Edit Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: QuoteState,
      actions: QuoteEditActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['Load', 'Delete'],
      customTests: [
        {
          it: 'returns a clone of the state with loading: true',
          previousState: QuoteState.initialState,
          expectedNextState: { ...QuoteState.initialState, loading: true }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['LoadSuccess', 'DeleteSuccess'],
      customTests: [
        {
          it: 'returns the state with the requested quote and loading: false',
          previousState: { ...QuoteState.initialState, loading: true },
          actionParameters: { quote: { some: 'quote' } },
          expectedNextState: { data: { some: 'quote' }, loading: false }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['LoadFailure', 'DeleteFailure'],
      mutationTestData: {
        previousState: { loading: true }
      },
      customTests: [
        {
          it: 'returns a clone of the state with loading: false',
          previousState: { ...QuoteState.initialState, loading: true },
          expectedNextState: { ...QuoteState.initialState, loading: false }
        }
      ]
    });
  });
}
