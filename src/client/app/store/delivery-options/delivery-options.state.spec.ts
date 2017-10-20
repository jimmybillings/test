import * as DeliveryOptionsState from './delivery-options.state';
import * as DeliveryOptionsActions from './delivery-options.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Delivery Options Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: DeliveryOptionsActions,
      state: DeliveryOptionsState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Load',
      mutationTestData: {
        previousState: DeliveryOptionsState.initialState
      },
      customTests: [
        {
          it: 'returns the state but with loading: true',
          previousState: DeliveryOptionsState.initialState,
          expectedNextState: { ...DeliveryOptionsState.initialState, loading: true }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'LoadSuccess',
      mutationTestData: {
        previousState: { hasDeliveryOptions: false, options: [], loading: true },
        actionParameters: { options: [{ some: 'options' }] }
      },
      customTests: [
        {
          it: 'returns the right state when there are delivery options',
          previousState: { hasDeliveryOptions: false, options: [], loading: true },
          actionParameters: { options: [{ some: 'options' }] },
          expectedNextState: { hasDeliveryOptions: true, options: [{ some: 'options' }], loading: false }
        },
        {
          it: 'returns the right state when there are NO delivery options',
          previousState: { hasDeliveryOptions: false, options: [], loading: true },
          actionParameters: { options: [] },
          expectedNextState: { hasDeliveryOptions: false, options: [], loading: false }
        }
      ]
    });

  });
}
