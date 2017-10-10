import * as QuoteShowAssetState from './quote-show-asset.state';
import * as QuoteShowAssetActions from './quote-show-asset.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Quote Show Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: QuoteShowAssetState,
      actions: QuoteShowAssetActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      customTests: [
        {
          it: 'returns the state with loading: true and new load parameters',
          actionParameters: { id: 47, assetUuid: 'some UUID' },
          previousState: QuoteShowAssetState.initialState,
          expectedNextState: { ...QuoteShowAssetState.initialState, loading: true, loadingUuid: 'some UUID' }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadingUuid: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...QuoteShowAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
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
          previousState: { ...QuoteShowAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
          expectedNextState: { ...QuoteShowAssetState.initialState, loading: false, loadingUuid: null }
        }
      ]
    });
  });
}
