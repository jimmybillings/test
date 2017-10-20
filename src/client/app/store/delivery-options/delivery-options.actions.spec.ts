import { ActionFactory, InternalActionFactory } from './delivery-options.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Delivery Options Actions', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [{ some: 'asset' }]
      },
      expectedAction: {
        type: '[Delivery Options] Load',
        activeAsset: { some: 'asset' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadSuccess',
        parameters: [[{ some: 'options' }]]
      },
      expectedAction: {
        type: '[Delivery Options] Load Success',
        options: [{ some: 'options' }]
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadFailure',
        parameters: [{ some: 'error' }]
      },
      expectedAction: {
        type: '[Delivery Options] Load Failure',
        error: { some: 'error' }
      }
    });
  });
}
