import * as QuoteShowAssetState from './quote-show-asset.state';
import * as QuoteShowAssetActions from '../actions/quote-show-asset.actions';
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
          actionParameters: { quoteId: 47, loadParameters: { some: 'params' } },
          previousState: QuoteShowAssetState.initialState,
          expectedNextState: { ...QuoteShowAssetState.initialState, loading: true, loadParameters: { some: 'params' } }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadParameters: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...QuoteShowAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
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
          previousState: { ...QuoteShowAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
          expectedNextState: { ...QuoteShowAssetState.initialState, loading: false, loadParameters: null }
        }
      ]
    });
  });
}
