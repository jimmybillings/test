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
  });
}
