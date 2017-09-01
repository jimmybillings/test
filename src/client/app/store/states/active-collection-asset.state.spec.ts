import * as ActiveCollectionAssetState from './active-collection-asset.state';
import * as ActiveCollectionAssetActions from '../actions/active-collection-asset.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Active Collection Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: ActiveCollectionAssetActions,
      state: ActiveCollectionAssetState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      customTests: [
        {
          it: 'returns the state with loading: true and new load parameters',
          actionParameters: { loadParameters: { some: 'params' } },
          previousState: ActiveCollectionAssetState.initialState,
          expectedNextState: { ...ActiveCollectionAssetState.initialState, loading: true, loadParameters: { some: 'params' } }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadParameters: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...ActiveCollectionAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
          expectedNextState: { activeAsset: { some: 'asset' }, loading: false, loadParameters: null }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadFailure',
      mutationTestData: {
        previousState: { loading: false }
      },
      customTests: [
        {
          it: 'returns the state with loading: false',
          previousState: { ...ActiveCollectionAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
          expectedNextState: { ...ActiveCollectionAssetState.initialState, loading: false, loadParameters: null }
        }
      ]
    });
  });
}
