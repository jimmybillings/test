import * as SpeedPreviewActions from './speed-preview.actions';
import * as SpeedPreviewState from './speed-preview.state';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Speed Preview Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: SpeedPreviewActions,
      state: SpeedPreviewState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      mutationTestData: {
        actionParameters: { asset: { assetId: 444444 } }
      },
      customTests: [
        {
          it: 'returns previous state but with loadingAssetId: ${asset.assetId}',
          previousState: {
            222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            loadingAssetId: undefined
          },
          actionParameters: { asset: { assetId: 444444 } },

          expectedNextState: {
            222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            loadingAssetId: 444444
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      mutationTestData: {
        actionParameters: { speedViewData: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' } }
      },
      customTests: [
        {
          it: 'returns new state with updated speedview data objects and loadingAssetId: undefined',

          previousState: {
            222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            loadingAssetId: 444444
          },

          actionParameters: { speedViewData: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' } },

          expectedNextState: {
            222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            444444: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            loadingAssetId: undefined
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadFailure',
      mutationTestData: {
        actionParameters: { speedViewData: {} }
      },
      customTests: [
        {
          it: 'returns new state with the noData property set to true',

          previousState: {
            222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            loadingAssetId: 444444
          },

          actionParameters: { speedViewData: {} },

          expectedNextState: {
            222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            444444: { noData: true },
            loadingAssetId: undefined
          }
        }
      ]
    });
  });
}
