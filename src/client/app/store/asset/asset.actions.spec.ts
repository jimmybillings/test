import { ActionFactory, InternalActionFactory } from './asset.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Asset Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'loadDeliveryOptions',
        parameters: [{ some: 'asset' }]
      },
      expectedAction: {
        type: '[Asset] Load Delivery Options',
        activeAsset: { some: 'asset' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadDeliveryOptionsSuccess',
        parameters: [[{ some: 'options' }]]
      },
      expectedAction: {
        type: '[Asset] Load Delivery Options Success',
        options: [{ some: 'options' }]
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadDeliveryOptionsFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Asset] Load Delivery Options Failure',
        error: { some: 'error' }
      }
    });
  });
}
