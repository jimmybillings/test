import * as OrderAssetState from './order-asset.state';
import * as OrderAssetActions from './order-asset.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Order Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: OrderAssetState,
      actions: OrderAssetActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      customTests: [
        {
          it: 'returns the state with loading: true and new load parameters',
          actionParameters: { orderId: 47, assetUuid: 'some UUID' },
          previousState: OrderAssetState.initialState,
          expectedNextState: { ...OrderAssetState.initialState, loading: true, loadingUuid: 'some UUID' }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadingUuid: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...OrderAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
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
          previousState: { ...OrderAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
          expectedNextState: { ...OrderAssetState.initialState, loading: false, loadingUuid: null }
        }
      ]
    });
  });
}
