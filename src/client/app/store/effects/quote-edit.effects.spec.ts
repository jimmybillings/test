import * as QuoteEditActions from '../actions/quote-edit.actions';
import { QuoteEditEffects } from './quote-edit.effects';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Quote Edit Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new QuoteEditEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
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

    effectsSpecHelper.generateTestsFor({
      effectName: 'changeRouteOnDeleteSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.DeleteSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'router',
          methodName: 'goToQuotes',
          expectedArguments: []
        }
      }
    });


    effectsSpecHelper.generateTestsFor({
      effectName: 'editLineItemFromDetails',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.EditLineItemFromDetails.Type,
        uuid: 'abc-123',
        markers: { in: 1, out: 2 },
        attributes: { some: 'attribute' }
      },
      state: {
        storeSectionName: 'quoteEdit',
        value: { data: { id: 77, projects: [{ lineItems: [{ id: 'abc-123', asset: { some: 'asset' } }] }] } }
      },
      serviceMethod: {
        name: 'editLineItem',
        returnsObservableOf: { some: 'quote' },
        expectedArguments: [77, { id: 'abc-123', asset: { some: 'asset' } }, { in: 1, out: 2 }, { some: 'attribute' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEdit',
          methodName: 'editLineItemFromDetailsSuccess',
          expectedArguments: [{ some: 'quote' }]
        },
        failure: {
          sectionName: 'quoteEdit',
          methodName: 'editLineItemFromDetailsFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'showSnackbarOnEditLineItemSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.EditLineItemFromDetailsSuccess.Type,
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['ASSET.DETAIL.QUOTE_ITEM_UPDATED']
        }
      }
    });
  });
}
