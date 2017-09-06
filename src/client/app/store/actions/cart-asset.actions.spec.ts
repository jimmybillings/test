import { ActionFactory, InternalActionFactory } from './cart-asset.actions';
import { ActionsSpecHelper } from '../../store/spec-helpers/actions.spec-helper';

export function main() {
  describe('Cart Asset Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Cart Asset] Load',
        loadParameters: { some: 'load parameters' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'loadAfterCartAvailable',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Cart Asset] Load After Cart Available',
        loadParameters: { some: 'load parameters' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadSuccess',
        parameters: [{ some: 'asset' }]
      },
      expectedAction: {
        type: '[Cart Asset] Load Success',
        activeAsset: { some: 'asset' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Cart Asset] Load Failure',
        error: { some: 'error' }
      }
    });
  });
}
