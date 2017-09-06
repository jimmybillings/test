import { ActionFactory, InternalActionFactory } from './active-collection-asset.actions';
import { ActionsSpecHelper } from '../../store/spec-helpers/actions.spec-helper';

export function main() {
  describe('Active Collection Asset Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Active Collection Asset] Load',
        loadParameters: { some: 'load parameters' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'loadAfterCollectionAvailable',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Active Collection Asset] Load After Collection Available',
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
        type: '[Active Collection Asset] Load Success',
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
        type: '[Active Collection Asset] Load Failure',
        error: { some: 'error' }
      }
    });
  });
}
