import * as CheckoutState from './checkout.state';
import * as CheckoutActions from './checkout.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Checkout Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: CheckoutActions,
      state: CheckoutState,
    });
  });
}
