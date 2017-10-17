import * as CartAssetState from './cart-asset.state';
import * as CartAssetActions from './cart-asset.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Cart Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: CartAssetState,
      actions: CartAssetActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      customTests: [
        {
          it: 'returns the state with loading: true and new load parameters',
          actionParameters: { assetUuid: 'some UUID' },
          previousState: CartAssetState.initialState,
          expectedNextState: { ...CartAssetState.initialState, loading: true, loadingUuid: 'some UUID' }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadingUuid: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...CartAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
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
          previousState: { ...CartAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
          expectedNextState: { ...CartAssetState.initialState, loading: false, loadingUuid: null }
        }
      ]
    });
  });
}
