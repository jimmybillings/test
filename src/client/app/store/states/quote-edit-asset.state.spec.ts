import * as QuoteEditAssetState from './quote-edit-asset.state';
import * as QuoteEditAssetActions from '../actions/quote-edit-asset.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Quote Asset Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      state: QuoteEditAssetState,
      actions: QuoteEditAssetActions
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      customTests: [
        {
          it: 'returns the state with loading: true and new load parameters',
          actionParameters: { loadParameters: { some: 'params' } },
          previousState: QuoteEditAssetState.initialState,
          expectedNextState: { ...QuoteEditAssetState.initialState, loading: true, loadParameters: { some: 'params' } }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      customTests: [
        {
          it: 'returns the state with the new asset, loading: false, and loadParameters: null',
          actionParameters: { activeAsset: { some: 'asset' } },
          previousState: { ...QuoteEditAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
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
          previousState: { ...QuoteEditAssetState.initialState, loading: true, loadParameters: { some: 'params' } },
          expectedNextState: { ...QuoteEditAssetState.initialState, loading: false, loadParameters: null }
        }
      ]
    });
  });
}
