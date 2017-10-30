import * as PricingState from './pricing.state';
import * as PricingActions from './pricing.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Pricing Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: PricingActions,
      state: PricingState,
    });
  });
}
