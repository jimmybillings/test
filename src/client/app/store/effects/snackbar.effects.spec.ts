import { SnackbarEffects } from './snackbar.effects';
import * as SnackbarActions from '../actions/snackbar.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Snackbar Effects', () => {
    let effectsSpecHelper: EffectsSpecHelper;

    function instantiator(): any {
      return new SnackbarEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    beforeEach(() => {
      effectsSpecHelper = new EffectsSpecHelper();
    });

    describe('display', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
