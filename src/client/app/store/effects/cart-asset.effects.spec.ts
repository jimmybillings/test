import { CartAssetEffects } from './cart-asset.effects';
import * as CartAssetActions from '../actions/cart-asset.actions';
import * as CartActions from '../actions/cart.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';
import { Frame } from 'wazee-frame-formatter';

export function main() {
  let mockLocation: any, mockRouter: any;

  describe('Cart Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new CartAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAfterCartAvailable',
      effectsInstantiator: instantiator,
      inputAction: {
        type: CartAssetActions.LoadAfterCartAvailable.Type,
        loadParameters: { id: '50', uuid: 'abc-123' }
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { assetId: '50' },
        expectedArguments: [{ id: '50', uuid: 'abc-123' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'cartAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ assetId: '50' }]
        },
        failure: {
          sectionName: 'cartAsset',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the cart is NOT yet loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'cart',
        value: { data: { id: null } }
      },
      inputAction: {
        type: CartAssetActions.Load.Type,
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
      effectName: 'load',
      comment: 'when the cart IS loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'cart',
        value: {
          data: {
            id: 1,
            projects: [
              { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
            ]
          }
        }
      },
      inputAction: {
        type: CartAssetActions.Load.Type,
        loadParameters: { uuid: 'abc-123' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'cartAsset',
          methodName: 'loadAfterCartAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAssetOnCartLoadSuccess',
      comment: 'when the asset store HAS load parameters',
      effectsInstantiator: instantiator,
      state: [
        {
          storeSectionName: 'cartAsset',
          value: { loadParameters: { uuid: 'abc-123' } }
        },
        {
          storeSectionName: 'cart',
          value: {
            data: {
              id: 1,
              projects: [
                { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
              ]
            }
          }
        }
      ],
      inputAction: {
        type: CartActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'cartAsset',
          methodName: 'loadAfterCartAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });
  });
}
