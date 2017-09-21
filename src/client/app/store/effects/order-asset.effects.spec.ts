import { OrderAssetEffects } from './order-asset.effects';
import * as OrderAssetActions from '../actions/order-asset.actions';
import * as OrderActions from '../actions/order.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Order Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new OrderAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAfterOrderAvailable',
      effectsInstantiator: instantiator,
      inputAction: {
        type: OrderAssetActions.LoadAfterOrderAvailable.Type,
        loadParameters: { id: '50', uuid: 'abc-123' }
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { assetId: '50' },
        expectedArguments: [{ id: '50', uuid: 'abc-123' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'orderAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ assetId: '50' }]
        },
        failure: {
          sectionName: 'orderAsset',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the order is NOT yet loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'order',
        propertyName: 'activeOrder',
        value: { id: 0, data: { id: null } }
      },
      inputAction: {
        type: OrderAssetActions.Load.Type,
        orderId: 47,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'order',
          methodName: 'load',
          expectedArguments: [47]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the order IS loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'order',
        propertyName: 'activeOrder',
        value: {
          id: 47,
          projects: [
            { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
          ]
        }
      },
      inputAction: {
        type: OrderAssetActions.Load.Type,
        orderId: 47,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'orderAsset',
          methodName: 'loadAfterOrderAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAssetOnOrderLoadSuccess',
      comment: 'when the asset store HAS load parameters',
      effectsInstantiator: instantiator,
      state: [
        {
          storeSectionName: 'orderAsset',
          propertyName: 'loadingUuid',
          value: 'abc-123'
        },
        {
          storeSectionName: 'order',
          propertyName: 'activeOrder',
          value: {
            id: 1,
            projects: [
              { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
            ]
          }
        }
      ],
      inputAction: {
        type: OrderActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'orderAsset',
          methodName: 'loadAfterOrderAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAssetOnOrderLoadSuccess',
      comment: 'when the asset UUID doesn\'t exist in the order',
      effectsInstantiator: instantiator,
      state: [
        {
          storeSectionName: 'orderAsset',
          propertyName: 'loadingUuid',
          value: 'xyz-not-present'
        },
        {
          storeSectionName: 'order',
          propertyName: 'activeOrder',
          value: {
            id: 1,
            projects: [
              { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
            ]
          }
        }
      ],
      inputAction: {
        type: OrderActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'orderAsset',
          methodName: 'loadFailure',
          expectedArguments: [{ status: 404 }]
        }
      }
    });
  });
}
