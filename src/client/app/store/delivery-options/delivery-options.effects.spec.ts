import { DeliveryOptionsEffects } from './delivery-options.effects';
import * as DeliveryOptionsActions from './delivery-options.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Delivery Options Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): DeliveryOptionsEffects {
      return new DeliveryOptionsEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadDeliveryOptions',
      effectsInstantiator: instantiator,
      inputAction: {
        type: DeliveryOptionsActions.Load.Type,
        activeAsset: { assetId: 123 }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [123],
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
  });
}
