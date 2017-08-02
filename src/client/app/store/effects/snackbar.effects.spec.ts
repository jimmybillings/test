import { SnackbarEffects } from './snackbar.effects';
import * as SnackbarActions from '../actions/snackbar.actions';
import { StoreSpecHelper } from '../store.spec-helper';

export function main() {
  describe('Snackbar Effects', () => {
    let storeSpecHelper: StoreSpecHelper;

    function instantiator(): any {
      return new SnackbarEffects(storeSpecHelper.mockNgrxEffectsActions, storeSpecHelper.mockStore, storeSpecHelper.mockService);
    }

    beforeEach(() => {
      storeSpecHelper = new StoreSpecHelper();
    });

    describe('display', () => {
      it('works as expected', () => {
        storeSpecHelper.runStandardEffectTest({
          effectName: 'display',
          effectsInstantiator: instantiator,
          inputAction: {
            type: SnackbarActions.Display.Type,
            messageKey: 'someMessageKey',
            messageParameters: { some: 'parameters' }
          },
          serviceMethod: {
            name: 'display',
            expectedArguments: ['someMessageKey', { some: 'parameters' }],
            returnsObservableOf: 'translatedString'
          },
          outputActionFactory: {
            sectionName: 'snackbar',
            methodName: 'displaySuccess',
            expectedArguments: ['translatedString']
          }
        });
      });
    });
  });
}
