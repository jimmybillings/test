import { AssetEffects } from './asset.effects';
import * as AssetActions from '../actions/asset.actions';
import { StoreSpecHelper } from '../store.spec-helper';

export function main() {
  describe('Asset Effects', () => {
    let storeSpecHelper: StoreSpecHelper;

    function instantiator(): any {
      return new AssetEffects(storeSpecHelper.mockNgrxEffectsActions, storeSpecHelper.mockStore, storeSpecHelper.mockService);
    }

    beforeEach(() => {
      storeSpecHelper = new StoreSpecHelper();
    });

    describe('load', () => {
      it('works as expected', () => {
        storeSpecHelper.runStandardEffectTest({
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
