import { ActionFactory, InternalActionFactory } from './snackbar.actions';
import { StoreSpecHelper } from '../store.spec-helper';

export function main() {
  describe('Snackbar Action Factory', () => {
    let storeSpecHelper: StoreSpecHelper = new StoreSpecHelper();

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'display',
        parameters: ['some key', { some: 'parameters' }]
      },
      expectedAction: {
        type: '[Snackbar] Display',
        messageKey: 'some key',
        messageParameters: { some: 'parameters' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      comment: 'with no parameters',
      factoryMethod: {
        class: ActionFactory,
        name: 'display',
        parameters: ['some key']
      },
      expectedAction: {
        type: '[Snackbar] Display',
        messageKey: 'some key',
        messageParameters: {}
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'displaySuccess',
        parameters: ['some translated string']
      },
      expectedAction: {
        type: '[Snackbar] Display Success',
        translatedMessage: 'some translated string'
      }
    });
  });
}
