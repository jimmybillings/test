import { HelpRequestEffects } from './help-request.effects';
import * as HelpRequestActions from './help-request.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Help Request Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): HelpRequestEffects {
      return new HelpRequestEffects(
        effectsSpecHelper.mockNgrxEffectsActions,
        effectsSpecHelper.mockStore,
        effectsSpecHelper.mockService,
        effectsSpecHelper.mockService
      );
    }
  });
}
