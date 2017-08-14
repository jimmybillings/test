import { DialogEffects } from './dialog.effects';
import * as DialogActions from '../actions/dialog.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Dialog Effects', () => {
    let effectsSpecHelper: EffectsSpecHelper;

    function instantiator(): DialogEffects {
      return new DialogEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    beforeEach(() => {
      effectsSpecHelper = new EffectsSpecHelper();
    });

    describe('showConfirmation', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'showConfirmation',
          effectsInstantiator: instantiator,
          inputAction: {
            type: DialogActions.ShowConfirmation.Type,
            confirmationDialogOptions: { some: 'option' },
            onAccept: () => { },
            onDecline: () => { }
          },
          serviceMethod: {
            name: 'openConfirmationDialog',
            expectedArguments: [{ some: 'option' }, jasmine.any(Function), jasmine.any(Function)],
            returnsObservableOf: '',
          },
          outputActionFactory: {
            sectionName: 'dialog',
            methodName: 'showConfirmationSuccess',
            expectedArguments: []
          }
        });
      });
    });
  });
}
