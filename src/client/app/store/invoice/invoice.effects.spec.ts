import * as InvoiceActions from './invoice.actions';
import { InvoiceEffects } from './invoice.effects';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Invoice Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new InvoiceEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: InvoiceActions.Load.Type,
        orderId: 47
      },
      serviceMethod: {
        name: 'load',
        expectedArguments: [47],
        returnsObservableOf: { some: 'invoice' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'invoice',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'invoice' }]
        },
        failure: {
          sectionName: 'invoice',
          methodName: 'loadFailure'
        }
      }
    });
  });
}
