import { PricingEffects } from './pricing.effects';
import * as PricingActions from './pricing.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Pricing Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): PricingEffects {
      return new PricingEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }
  });
}
