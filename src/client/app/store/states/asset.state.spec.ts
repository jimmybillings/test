import * as AssetActions from '../actions/asset.actions';
import * as AssetState from './asset.state';
import { StoreSpecHelper } from '../store.spec-helper';

export function main() {
  const storeSpecHelper: StoreSpecHelper = new StoreSpecHelper();

  describe('Asset Reducer', () => {
    storeSpecHelper.setReducerTestModules({
      actions: AssetActions,
      state: AssetState,
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'Load',
      mutationTestData: {
        previousState: { loaded: true }
      },
      customTests: [
        {
          it: 'with previous state, returns previous state but with loaded: false',
          previousState: { some: 'stuff', loaded: true },
          expectedNextState: { some: 'stuff', loaded: false }
        },
        {
          it: 'without previous state, returns initialState but with loaded: false',
          expectedNextState: { ...AssetState.initialState, loaded: false }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'with previous state, returns new state with updated asset and loaded: true',
          previousState: { activeAsset: 'previous', loaded: false },
          actionParameters: { activeAsset: 'new' },
          expectedNextState: { activeAsset: 'new', loaded: true }
        },
        {
          it: 'without previous state, returns new state with updated asset and loaded: true',
          actionParameters: { activeAsset: 'new' },
          expectedNextState: { activeAsset: 'new', loaded: true }
        }
      ]
    });
  });
}
