import { AssetEffects } from './asset.effects';
import * as AssetActions from '../actions/asset.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Asset Effects', () => {
    let effectsSpecHelper: EffectsSpecHelper;

    function instantiator(): any {
      return new AssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService, {} as any, {} as any
      );
    }

    beforeEach(() => {
      effectsSpecHelper = new EffectsSpecHelper();
    });

    describe('load', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'asset',
            methodName: 'loadSuccess',
            expectedArguments: [{ some: 'asset' }]
          }
        });
      });
    });
  });
}
