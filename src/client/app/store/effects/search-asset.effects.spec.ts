import { SearchAssetEffects } from './search-asset.effects';
import * as SearchAssetActions from '../actions/search-asset.actions';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Search Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new SearchAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService, {} as any, {} as any
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SearchAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      serviceMethod: {
        name: 'load',
        expectedArguments: [{ some: 'loadParameters' }],
        returnsObservableOf: { some: 'asset' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'searchAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'asset' }]
        },
        failure: {
          sectionName: 'searchAsset',
          methodName: 'loadFailure'
        }
      }
    });
  });
}
