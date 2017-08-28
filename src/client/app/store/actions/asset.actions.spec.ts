import { ActionFactory, InternalActionFactory } from './asset.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Asset Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [{ some: 'load parameters' }]
      },
      expectedAction: {
        type: '[Asset] Load',
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
        type: '[Asset] Load Success',
        activeAsset: { some: 'asset' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadCollectionAsset',
        parameters: [{ some: 'params' }]
      },
      expectedAction: {
        type: '[Asset] Load Collection Asset',
        loadParameters: { some: 'params' }
      }
    });
  });
}
