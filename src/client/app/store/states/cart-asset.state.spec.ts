import * as CartAssetState from './cart-asset.state';
import * as CartAssetActions from '../actions/cart-asset.actions';
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
          actionParameters: { loadParameters: { some: 'params' } },
          previousState: CartAssetState.initialState,
          expectedNextState: { ...CartAssetState.initialState, loading: true, loadParameters: { some: 'params' } }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadParameters: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...CartAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
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
          previousState: { ...CartAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
          expectedNextState: { ...CartAssetState.initialState, loading: false, loadParameters: null }
        }
      ]
    });
  });
}
