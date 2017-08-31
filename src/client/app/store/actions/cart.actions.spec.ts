import { ActionFactory, InternalActionFactory } from './cart.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Comment Action Factory', () => {
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
        name: 'loadAsset',
        parameters: [{ uuid: 'abc-123' }]
      },
      expectedAction: {
        type: '[Cart] Load Asset',
        loadParameters: { uuid: 'abc-123' }
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
  });
}
