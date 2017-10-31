import { PricingEffects } from './pricing.effects';
import * as PricingActions from './pricing.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Pricing Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();
    let mockDialogService: any;

    function instantiator(): PricingEffects {
      mockDialogService = { openComponentInDialog: jasmine.createSpy('openComponentInDialog') };
      return new PricingEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService, mockDialogService
      );
    }
  });
}
