import { CartEffects } from './cart.effects';
import * as CartActions from '../actions/cart.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Cart Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new CartEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: CartActions.Load.Type
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { some: 'cart' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'cart',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'cart' }]
        },
        failure: {
          sectionName: 'cart',
          methodName: 'loadFailure'
        }
      }
    });
  });
}
