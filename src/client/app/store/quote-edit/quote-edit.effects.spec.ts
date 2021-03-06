import * as QuoteEditActions from './quote-edit.actions';
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

    effectsSpecHelper.generateTestsFor({
      effectName: 'removeAsset',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.RemoveAsset.Type,
        asset: { some: 'asset' }
      },
      state: {
        storeSectionName: 'quoteEdit',
        propertyName: 'data',
        value: { id: { some: 'quoteId' } }
      },
      serviceMethod: {
        name: 'removeAsset',
        expectedArguments: [{ some: 'quoteId' }, { some: 'asset' }],
        returnsObservableOf: { some: 'quote' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEdit',
          methodName: 'removeAssetSuccess',
          expectedArguments: [{ some: 'quote' }]
        },
        failure: {
          sectionName: 'quoteEdit',
          methodName: 'removeAssetFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'changeRouteOnRemoveAssetSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.RemoveAssetSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'router',
          methodName: 'goToActiveQuote',
          expectedArguments: []
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'showSnackbarOnRemoveAssetSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.RemoveAssetSuccess.Type,
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['QUOTE.REMOVE_ASSET.SUCCESS']
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'addCustomPriceToLineItem',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditActions.AddCustomPriceToLineItem.Type,
        lineItem: { some: 'lineItem' },
        price: 10000
      },
      state: {
        storeSectionName: 'quoteEdit',
        value: { data: { id: 10 } }
      },
      serviceMethod: {
        name: 'addCustomPriceToLineItem',
        expectedArguments: [10, { some: 'lineItem' }, 10000],
        returnsObservableOf: { some: 'quote' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEdit',
          methodName: 'addCustomPriceToLineItemSuccess',
          expectedArguments: [{ some: 'quote' }]
        },
        failure: {
          sectionName: 'quoteEdit',
          methodName: 'addCustomPriceToLineItemFailure'
        }
      }
    });
  });
}
