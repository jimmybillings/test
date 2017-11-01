import * as FeeConfigState from './fee-config.state';
import * as FeeConfigActions from './fee-config.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Fee Config Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: FeeConfigActions,
      state: FeeConfigState,
    });
  });
}
