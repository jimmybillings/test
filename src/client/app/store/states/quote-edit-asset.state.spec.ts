import * as QuoteEditAssetState from './quote-edit-asset.state';
import * as QuoteEditAssetActions from '../actions/quote-edit-asset.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Quote Edit Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: QuoteEditAssetState,
      actions: QuoteEditAssetActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      customTests: [
        {
          it: 'returns the state with loading: true and new load parameters',
          actionParameters: { assetUuid: 'some UUID' },
          previousState: QuoteEditAssetState.initialState,
          expectedNextState: { ...QuoteEditAssetState.initialState, loading: true, loadingUuid: 'some UUID' }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadingUuid: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...QuoteEditAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
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
          previousState: { ...QuoteEditAssetState.initialState, loading: true, loadingUuid: 'some UUID' },
          expectedNextState: { ...QuoteEditAssetState.initialState, loading: false, loadingUuid: null }
        }
      ]
    });
  });
}
