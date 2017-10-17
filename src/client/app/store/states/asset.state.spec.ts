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
      actionClassName: 'SetDeliveryOptions',
      mutationTestData: {
        previousState: { hasDeliveryOptions: false }
      },
      customTests: [
        {
          it: 'returns the state but with hasDeliveryOptions: true',
          previousState: { hasDeliveryOptions: false },
          actionParameters: { flag: true },
          expectedNextState: { hasDeliveryOptions: true }
        }
      ]
    });
  });
}
