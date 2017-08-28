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

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'with previous state, returns new state with updated asset and loaded: true',
          previousState: { activeAsset: 'previous', loaded: false },
          actionParameters: { activeAsset: 'new' },
          expectedNextState: { activeAsset: 'new', loaded: true, loadParameters: null }
        },
        {
          it: 'without previous state, returns new state with updated asset and loaded: true',
          actionParameters: { activeAsset: 'new' },
          expectedNextState: { activeAsset: 'new', loaded: true, loadParameters: null }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadCollectionAsset',
      customTests: [
        {
          it: 'without previous state, returns inital state with the loadParameters',
          actionParameters: { loadParameters: { uuid: 'abc-123' } },
          expectedNextState: { activeAsset: { assetId: 0, name: '' }, loaded: false, loadParameters: { uuid: 'abc-123' } }
        },
        {
          it: 'with previous state, returns the state with the loadParameters',
          previousState: { activeAsset: 'previous', loaded: false },
          actionParameters: { loadParameters: { uuid: 'abc-123' } },
          expectedNextState: { activeAsset: 'previous', loaded: false, loadParameters: { uuid: 'abc-123' } }
        }
      ]
    });
  });
}
