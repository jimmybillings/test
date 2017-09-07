import { ActionFactory, InternalActionFactory } from './quote-show-asset.actions';
import { ActionsSpecHelper } from '../../store/spec-helpers/actions.spec-helper';

export function main() {
  describe('Quote Show Asset Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [47, { some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Quote Show Asset] Load',
        quoteId: 47,
        loadParameters: { some: 'load parameters' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadAfterQuoteAvailable',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Quote Show Asset] Load After Quote Available',
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
        type: '[Quote Show Asset] Load Success',
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
        type: '[Quote Show Asset] Load Failure',
        error: { some: 'error' }
      }
    });
  });
}
