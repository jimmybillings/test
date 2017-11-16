import { DeliveryOptionsEffects } from './delivery-options.effects';
import * as DeliveryOptionsActions from './delivery-options.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Delivery Options Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();
    let mockWindowRef: any;

    function instantiator(): DeliveryOptionsEffects {
      mockWindowRef = { nativeWindow: { location: { href: '' } } };
      return new DeliveryOptionsEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService, mockWindowRef
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadDeliveryOptions',
      effectsInstantiator: instantiator,
      inputAction: {
        type: DeliveryOptionsActions.Load.Type,
        activeAsset: { assetId: 123 },
        shareKey: 'abc-123'
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [123, 'abc-123'],
        returnsObservableOf: [{ some: 'deliveryOption' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'deliveryOptions',
          methodName: 'loadSuccess',
          expectedArguments: [[{ some: 'deliveryOption' }]]
        },
        failure: {
          sectionName: 'deliveryOptions',
          methodName: 'loadFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'download',
      effectsInstantiator: instantiator,
      inputAction: {
        type: DeliveryOptionsActions.Download.Type,
        option: { renditionUrl: { url: 'some-url' } }
      },
      customTests: [
        {
          it: 'sets the href property on the window',
          expectation: () => expect(mockWindowRef.nativeWindow.location.href).toEqual('some-url')
        }
      ]
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'downloadViaAspera',
      effectsInstantiator: instantiator,
      inputAction: {
        type: DeliveryOptionsActions.DownloadViaAspera.Type,
        option: { renditionUrl: { asperaSpec: 'some-url' } }
      },
      serviceMethod: {
        name: 'initializeAsperaConnection',
        expectedArguments: ['some-url']
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'deliver',
      effectsInstantiator: instantiator,
      inputAction: {
        type: DeliveryOptionsActions.Deliver.Type,
        assetId: 1,
        option: { deliveryOptionId: 2 },
        markers: { some: 'markers' }
      },
      serviceMethod: {
        name: 'deliverAsset',
        expectedArguments: [1, 2, { some: 'markers' }],
        returnsObservableOf: { some: 'order', id: 3 }
      },
      outputActionFactories: {
        success: {
          sectionName: 'deliveryOptions',
          methodName: 'deliverySuccess',
          expectedArguments: [3]
        },
        failure: {
          sectionName: 'deliveryOptions',
          methodName: 'deliveryFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'deliverySuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: DeliveryOptionsActions.DeliverySuccess.Type,
        orderId: 1
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['ASSET.DELIVERY_OPTIONS.DELIVERY_SUCCESS', { orderId: 1 }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'deliveryFailure',
      effectsInstantiator: instantiator,
      inputAction: {
        type: DeliveryOptionsActions.DeliveryFailure.Type,
        orderId: 1
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['ASSET.DELIVERY_OPTIONS.DELIVERY_ERROR']
        }
      }
    });
  });
}
