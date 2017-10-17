import * as ActiveCollectionAssetState from './active-collection-asset.state';
import * as ActiveCollectionAssetActions from './active-collection-asset.actions';
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
          actionParameters: { assetUuid: 'some UUID' },
          previousState: ActiveCollectionAssetState.initialState,
          expectedNextState: { ...ActiveCollectionAssetState.initialState, loading: true, loadingUuid: 'some UUID' }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadingUuid: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...ActiveCollectionAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
          expectedNextState: { activeAsset: { some: 'asset' }, loading: false, loadingUuid: null }
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
          previousState: { ...ActiveCollectionAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
          expectedNextState: { ...ActiveCollectionAssetState.initialState, loading: false, loadingUuid: null }
        }
      ]
    });
  });
}
