import { SpeedPreviewEffects } from './speed-preview.effects';
import * as SpeedPreviewActions from '../actions/speed-preview.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Speed View Effects', () => {
    let effectsSpecHelper: EffectsSpecHelper;

    function instantiator(): any {
      return new SpeedPreviewEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    beforeEach(() => {
      effectsSpecHelper = new EffectsSpecHelper();
    });

    describe('load', () => {
      it('works as expected when an asset is not available in the store', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'load',
          effectsInstantiator: instantiator,
          inputAction: {
            type: SpeedPreviewActions.Load.Type,
            asset: { assetId: 111111 }
          },
          state: {
            storeSectionName: 'speedPreview',
            value: {
              222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
              333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            }
          },
          serviceMethod: {
            name: 'load',
            expectedArguments: [{ assetId: 111111 }],
            returnsObservableOf: {
              111111: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            }
          },
          outputActionFactory: {
            sectionName: 'speedPreview',
            methodName: 'loadSuccess',
            expectedArguments: [{ 111111: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' } }]
          }
        });
      });

      it('works as expected when the asset is already in the store', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'load',
          effectsInstantiator: instantiator,
          inputAction: {
            type: SpeedPreviewActions.Load.Type,
            asset: { assetId: 222222 }
          },
          state: {
            storeSectionName: 'speedPreview',
            value: {
              222222: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
              333333: { 'price': 159.0, 'imageQuickView': false, 'posterUrl': 'someposterurl' },
            }
          },
          expectToEmitValue: false,
          serviceMethod: {
            name: 'load',
            expectToHaveBeenCalled: false
          }
        });
      });
    });
  });
}
