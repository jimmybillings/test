import * as FeeConfigState from './fee-config.state';
import * as FeeConfigActions from './fee-config.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Fee Config Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: FeeConfigActions,
      state: FeeConfigState,
    });

    stateSpecHelper.setReducerTestModules({
      actions: FeeConfigActions,
      state: FeeConfigState,
    });

    // stateSpecHelper.generateTestsFor({
    //   actionClassName: 'LoadFeeConfig',
    //   mutationTestData: {
    //     actionParameters: { asset: { assetId: 444444 } }
    //   },
    //   customTests: [
    //     {
    //       it: 'returns previous state but with loadingAssetId: ${asset.assetId}',
    //       previousState: {
    //         222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         loadingAssetId: undefined
    //       },
    //       actionParameters: { asset: { assetId: 444444 } },

    //       expectedNextState: {
    //         222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         loadingAssetId: 444444
    //       }
    //     }
    //   ]
    // });

    // stateSpecHelper.generateTestsFor({
    //   actionClassName: 'LoadSuccess',
    //   mutationTestData: {
    //     actionParameters: { speedViewData: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' } }
    //   },
    //   customTests: [
    //     {
    //       it: 'returns new state with updated speedview data objects and loadingAssetId: undefined',

    //       previousState: {
    //         222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         loadingAssetId: 444444
    //       },

    //       actionParameters: { speedViewData: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' } },

    //       expectedNextState: {
    //         222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         444444: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
    //         loadingAssetId: undefined
    //       }
    //     }
    //   ]
    // });
  });
}
