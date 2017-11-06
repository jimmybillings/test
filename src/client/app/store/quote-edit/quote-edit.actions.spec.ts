import { ActionFactory, InternalActionFactory } from './quote-edit.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Quote Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: []
      },
      expectedAction: {
        type: '[Quote Edit] Load'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'loadSuccess',
        parameters: [{ some: 'quote' }]
      },
      expectedAction: {
        type: '[Quote Edit] Load Success',
        quote: { some: 'quote' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'delete',
        parameters: []
      },
      expectedAction: {
        type: '[Quote Edit] Delete'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'editLineItemFromDetails',
        parameters: ['abc-123', { in: 1, out: 2 }, { some: 'attribute' }]
      },
      expectedAction: {
        type: '[Quote Edit] Edit Line Item From Details',
        uuid: 'abc-123',
        markers: { in: 1, out: 2 },
        attributes: { some: 'attribute' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'addCustomPriceToLineItem',
        parameters: [{ some: 'lineItem' }, 1000]
      },
      expectedAction: {
        type: '[Quote Edit] Add Custom Price To LineItem',
        lineItem: { some: 'lineItem' },
        price: 1000
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Quote Edit] Load Failure',
        error: { some: 'error' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'deleteSuccess',
        parameters: [{ some: 'quote' }]
      },
      expectedAction: {
        type: '[Quote Edit] Delete Success',
        quote: { some: 'quote' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'deleteFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Quote Edit] Delete Failure',
        error: { some: 'error' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'editLineItemFromDetailsSuccess',
        parameters: [{ some: 'quote' }]
      },
      expectedAction: {
        type: '[Quote Edit] Edit Line Item From Details Success',
        quote: { some: 'quote' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'editLineItemFromDetailsFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Quote Edit] Edit Line Item From Details Failure',
        error: { some: 'error' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'removeAsset',
        parameters: [{ some: 'asset' }]
      },
      expectedAction: {
        type: '[Quote Edit] Remove Asset',
        asset: { some: 'asset' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'removeAssetSuccess',
        parameters: [{ some: 'quote' }]
      },
      expectedAction: {
        type: '[Quote Edit] Remove Asset Success',
        quote: { some: 'quote' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'removeAssetFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Quote Edit] Remove Asset Failure',
        error: { some: 'error' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'addCustomPriceToLineItemSuccess',
        parameters: [{ some: 'quote' }]
      },
      expectedAction: {
        type: '[Quote Edit] Add Custom Price To LineItem Success',
        quote: { some: 'quote' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'addCustomPriceToLineItemFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Quote Edit] Add Custom Price To LineItem Failure',
        error: { some: 'error' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'sendQuote',
        parameters: [{
          ownerEmail: 'ross.edfort@wazeedigital.com',
          expirationDate: '2017-03-22T06:00:00.000Z',
          purchaseType: 'Standard'
        }]
      },
      expectedAction: {
        type: '[Quote Edit] Send Quote',
        quoteOptions: {
          ownerEmail: 'ross.edfort@wazeedigital.com',
          expirationDate: '2017-03-22T06:00:00.000Z',
          purchaseType: 'Standard'
        }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'sendQuoteSuccess',
        parameters: [10, 'ross.edfort@wazeedigital.com']
      },
      expectedAction: {
        type: '[Quote Edit] Send Quote Success',
        quoteId: 10,
        ownerEmail: 'ross.edfort@wazeedigital.com'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'cloneQuote',
        parameters: [{ some: 'quote' }]
      },
      expectedAction: {
        type: '[Quote Edit] Clone Quote',
        quote: { some: 'quote' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'cloneQuoteSuccess',
        parameters: [{ some: 'quote' }]
      },
      expectedAction: {
        type: '[Quote Edit] Clone Quote Success',
        quote: { some: 'quote' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'createQuote',
        parameters: []
      },
      expectedAction: {
        type: '[Quote Edit] Create Quote',
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'updateQuoteField',
        parameters: [{ field: 'some field' }]
      },
      expectedAction: {
        type: '[Quote Edit] Update Quote Fields',
        options: { field: 'some field' }
      }
    });
  });
}
