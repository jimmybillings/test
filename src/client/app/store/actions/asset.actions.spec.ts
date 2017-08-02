import { ActionFactory, InternalActionFactory } from './asset.actions';
import { StoreSpecHelper } from '../store.spec-helper';

export function main() {
  describe('Asset Action Factory', () => {
    let storeSpecHelper: StoreSpecHelper = new StoreSpecHelper();

    storeSpecHelper.runStandardActionTestFor({
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

    storeSpecHelper.runStandardActionTestFor({
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
  });
}
