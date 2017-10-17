import { ActionFactory, InternalActionFactory } from './asset.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Asset Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'setDeliveryOptions',
        parameters: ['boolean']
      },
      expectedAction: {
        type: '[Asset] Set Delivery Options',
        flag: 'boolean'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'setDeliveryOptionsFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Asset] Set Delivery Options Failure',
        error: { some: 'error' }
      }
    });
  });
}
