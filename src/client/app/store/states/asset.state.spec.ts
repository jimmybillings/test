import * as AssetActions from '../actions/asset.actions';
import * as AssetState from './asset.state';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: AssetActions,
      state: AssetState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      mutationTestData: {
        previousState: { loading: false }
      },
      customTests: [
        {
          it: 'with previous state, returns previous state but with loading: true',
          previousState: { some: 'stuff', loading: false },
          expectedNextState: { some: 'stuff', loading: true }
        },
        {
          it: 'without previous state, returns initialState but with loading: true',
          expectedNextState: { ...AssetState.initialState, loading: true }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'with previous state, returns new state with updated asset and loading: false',
          previousState: { activeAsset: 'previous', loading: true },
          actionParameters: { activeAsset: 'new' },
          expectedNextState: { activeAsset: 'new', loading: false }
        },
        {
          it: 'without previous state, returns new state with updated asset and loading: false',
          actionParameters: { activeAsset: 'new' },
          expectedNextState: { activeAsset: 'new', loading: false }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadFailure',
      mutationTestData: {
        previousState: { loading: true }
      },
      customTests: [
        {
          it: 'with previous state, returns previous state but with loading: false',
          previousState: { some: 'stuff', loading: true },
          actionParameters: { error: { some: 'error' } },
          expectedNextState: { some: 'stuff', loading: false }
        },
        {
          it: 'without previous state, returns initial state',
          actionParameters: { error: { some: 'error' } },
          expectedNextState: AssetState.initialState
        }
      ]
    });
  });
}
