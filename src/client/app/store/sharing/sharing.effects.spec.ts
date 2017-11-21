import { SharingEffects } from './sharing.effects';
import * as SharingActions from './sharing.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Sharing Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): SharingEffects {
      return new SharingEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'createAssetShareLink',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SharingActions.CreateAssetShareLink.Type,
        assetId: 'someAssetId',
        markers: { some: 'markers' }
      },
      serviceMethod: {
        name: 'createAssetShareLink',
        expectedArguments: ['someAssetId', { some: 'markers' }],
        returnsObservableOf: 'link'
      },
      outputActionFactories: {
        success: {
          sectionName: 'sharing',
          methodName: 'createAssetShareLinkSuccess',
          expectedArguments: ['link']
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'emailAssetShareLink',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SharingActions.EmailAssetShareLink.Type,
        assetId: 'someAssetId',
        markers: { some: 'markers' },
        parameters: { some: 'paramaters' }
      },
      serviceMethod: {
        name: 'emailAssetShareLink',
        expectedArguments: ['someAssetId', { some: 'markers' }, { some: 'paramaters' }],
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['ASSET.SHARING.SHARED_CONFIRMED_MESSAGE']
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'emailCollectionShareLink',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SharingActions.EmailCollectionShareLink.Type,
        collectionId: 'someCollectionId',
        parameters: { some: 'paramaters' }
      },
      serviceMethod: {
        name: 'emailCollectionShareLink',
        expectedArguments: ['someCollectionId', { some: 'paramaters' }],
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['ASSET.SHARING.SHARED_CONFIRMED_MESSAGE']
        }
      }
    });

  });
}
