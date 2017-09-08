import { OrderEffects } from './order.effects';
import * as OrderActions from '../actions/order.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Order Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new OrderEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: OrderActions.Load.Type,
        orderId: 47
      },
      serviceMethod: {
        name: 'load',
        expectedArguments: [47],
        returnsObservableOf: { some: 'order' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'order',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'order' }]
        },
        failure: {
          sectionName: 'order',
          methodName: 'loadFailure'
        }
      }
    });
  });
}
