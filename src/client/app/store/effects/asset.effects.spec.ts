import { AssetEffects } from './asset.effects';
import * as AssetActions from '../actions/asset.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new AssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService, {} as any, {} as any
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: AssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      serviceMethod: {
        name: 'load',
        expectedArguments: [{ some: 'loadParameters' }],
        returnsObservableOf: { some: 'asset' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'asset' }]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'loadFailure'
        }
      }
    });
  });
}
