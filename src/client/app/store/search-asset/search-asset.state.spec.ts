import * as SearchAssetActions from './search-asset.actions';
import * as SearchAssetState from './search-asset.state';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Search Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: SearchAssetActions,
      state: SearchAssetState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      mutationTestData: {
        previousState: { loading: false }
      },
      customTests: [
        {
          it: 'returns the state but with loading: true and the action loadParameters',
          previousState: { activeAsset: { some: 'asset' }, loading: false, loadParameters: null },
          actionParameters: { loadParameters: { some: 'id' } },
          expectedNextState: { activeAsset: { some: 'asset' }, loading: true, loadParameters: { some: 'id' } }
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
          expectedNextState: { activeAsset: 'new', loading: false, loadParameters: null }
        },
        {
          it: 'without previous state, returns new state with updated asset and loading: false',
          actionParameters: { activeAsset: 'new' },
          expectedNextState: { activeAsset: 'new', loading: false, loadParameters: null }
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
          expectedNextState: SearchAssetState.initialState
        }
      ]
    });
  });
}
