import * as QuoteEditActions from '../actions/quote-edit.actions';
import { QuoteEditEffects } from './quote-edit.effects';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Quote Edit Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();
    let mockRouter: any;

    function instantiator(): any {
      mockRouter = {
        navigate: jasmine.createSpy('navigate')
      };

      return new QuoteEditEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService, mockRouter
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.Load.Type
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { some: 'quote' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEdit',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'quote' }]
        },
        failure: {
          sectionName: 'quoteEdit',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'delete',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'quoteEdit',
        value: { data: { id: 1 } }
      },
      inputAction: {
        type: QuoteEditActions.Delete.Type
      },
      serviceMethod: {
        name: 'delete',
        expectedArguments: [1],
        returnsObservableOf: { some: 'quote' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEdit',
          methodName: 'deleteSuccess',
          expectedArguments: [{ some: 'quote' }]
        },
        failure: {
          sectionName: 'quoteEdit',
          methodName: 'deleteFailure'
        }
      }
    });
  });
}
