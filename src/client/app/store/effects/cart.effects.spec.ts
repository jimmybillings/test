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

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAsset',
      comment: 'when the cart is NOT yet loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'cart',
        value: { data: { id: null } }
      },
      inputAction: {
        type: CartActions.LoadAsset.Type,
        loadParameters: { uuid: 'abc-123' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'cart',
          methodName: 'load',
          expectedArguments: []
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAsset',
      comment: 'when the cart IS loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'cart',
        value: {
          data: { id: 1, projects: [{ lineItems: [{ id: 'abc-123', asset: { assetId: 50, timeStart: 500, timeEnd: 5000 } }] }] }
        }
      },
      inputAction: {
        type: CartActions.LoadAsset.Type,
        loadParameters: { uuid: 'abc-123' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'load',
          expectedArguments: [{ id: '50', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'ensureCartIsLoaded',
      comment: 'when the asset store HAS load parameters',
      effectsInstantiator: instantiator,
      state: [
        {
          storeSectionName: 'asset',
          value: { loadParameters: { uuid: 'abc-123' } }
        },
        {
          storeSectionName: 'cart',
          value: {
            data: { id: 1, projects: [{ lineItems: [{ id: 'abc-123', asset: { assetId: 50, timeStart: 500, timeEnd: 5000 } }] }] }
          }
        }
      ],
      inputAction: {
        type: CartActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'load',
          expectedArguments: [{ id: '50', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });
  });
}
