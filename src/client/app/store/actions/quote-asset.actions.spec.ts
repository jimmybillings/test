import { ActionFactory, InternalActionFactory } from './quote-asset.actions';
import { ActionsSpecHelper } from '../../store/spec-helpers/actions.spec-helper';

export function main() {
  describe('Quote Asset Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Quote Asset] Load',
        loadParameters: { some: 'load parameters' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'loadAfterQuoteAvailable',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Quote Asset] Load After Quote Available',
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
        type: '[Quote Asset] Load Success',
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
        type: '[Quote Asset] Load Failure',
        error: { some: 'error' }
      }
    });
  });
}
