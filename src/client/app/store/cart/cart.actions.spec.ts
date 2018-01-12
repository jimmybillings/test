import { ActionFactory, InternalActionFactory } from './cart.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Cart Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: []
      },
      expectedAction: {
        type: '[Cart] Load'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'editLineItemFromDetails',
        parameters: ['abc-123', { in: 1, out: 2 }, { some: 'attribute' }]
      },
      expectedAction: {
        type: '[Cart] Edit Line Item From Details',
        uuid: 'abc-123',
        markers: { in: 1, out: 2 },
        attributes: { some: 'attribute' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadSuccess',
        parameters: [{ some: 'cart' }]
      },
      expectedAction: {
        type: '[Cart] Load Success',
        cart: { some: 'cart' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Cart] Load Failure',
        error: { some: 'error' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'editLineItemFromDetailsSuccess',
        parameters: [{ some: 'cart' }]
      },
      expectedAction: {
        type: '[Cart] Edit Line Item From Details Success',
        cart: { some: 'cart' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'editLineItemFromDetailsFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Cart] Edit Line Item From Details Failure',
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
        type: '[Cart] Remove Asset',
        asset: { some: 'asset' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'addLicenseStartDate',
        parameters: ['Some License Start Date', 'Some Project ID']
      },
      expectedAction: {
        type: '[Cart] Add License Start Date',
        licenseStartDate: 'Some License Start Date',
        projectId: 'Some Project ID'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'removeAssetSuccess',
        parameters: [{ some: 'cart' }]
      },
      expectedAction: {
        type: '[Cart] Remove Asset Success',
        cart: { some: 'cart' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'removeAssetFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Cart] Remove Asset Failure',
        error: { some: 'error' }
      }
    });
  });
}
