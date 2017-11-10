import { PrivacyPolicyEffects } from './privacy-policy.effects';
import * as PrivacyPolicyActions from './privacy-policy.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Privacy Policy Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): PrivacyPolicyEffects {
      return new PrivacyPolicyEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }
  });
}
