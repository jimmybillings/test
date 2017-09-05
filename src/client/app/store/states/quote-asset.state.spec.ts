import * as QuoteAssetState from './quote-asset.state';
import * as QuoteAssetActions from '../actions/quote-asset.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Quote Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: QuoteAssetState,
      actions: QuoteAssetActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      customTests: [
        {
          it: 'returns the state with loading: true and new load parameters',
          actionParameters: { loadParameters: { some: 'params' } },
          previousState: QuoteAssetState.initialState,
          expectedNextState: { ...QuoteAssetState.initialState, loading: true, loadParameters: { some: 'params' } }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadParameters: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...QuoteAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
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
          previousState: { ...QuoteAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
          expectedNextState: { ...QuoteAssetState.initialState, loading: false, loadParameters: null }
        }
      ]
    });
  });
}
