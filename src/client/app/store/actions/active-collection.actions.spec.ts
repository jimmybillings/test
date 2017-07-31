
import { ActionFactory, InternalActionFactory } from './active-collection.actions';
import { StoreSpecHelper } from '../store.spec-helper';

export function main() {
  describe('Active Collection Action Factory', () => {
    let storeSpecHelper: StoreSpecHelper = new StoreSpecHelper();

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: [{ currentPage: 42, pageSize: 50 }]
      },
      expectedAction: {
        type: '[Active Collection] Load',
        pagination: { currentPage: 42, pageSize: 50 }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      comment: 'with default parameters',
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: []
      },
      expectedAction: {
        type: '[Active Collection] Load',
        pagination: { currentPage: 1, pageSize: 100 }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'set',
        parameters: [99, { currentPage: 42, pageSize: 50 }]
      },
      expectedAction: {
        type: '[Active Collection] Set',
        collectionId: 99,
        pagination: { currentPage: 42, pageSize: 50 }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      comment: 'with default parameters',
      factoryMethod: {
        class: ActionFactory,
        name: 'set',
        parameters: [99]
      },
      expectedAction: {
        type: '[Active Collection] Set',
        collectionId: 99,
        pagination: { currentPage: 1, pageSize: 100 }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'loadPage',
        parameters: [{ currentPage: 42, pageSize: 50 }]
      },
      expectedAction: {
        type: '[Active Collection] Load Page',
        pagination: { currentPage: 42, pageSize: 50 }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      comment: 'with default parameters',
      factoryMethod: {
        class: ActionFactory,
        name: 'loadPage',
        parameters: []
      },
      expectedAction: {
        type: '[Active Collection] Load Page',
        pagination: { currentPage: 1, pageSize: 100 }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'addAsset',
        parameters: [{ some: 'asset' }, { some: 'markers' }]
      },
      expectedAction: {
        type: '[Active Collection] Add Asset',
        asset: { some: 'asset' },
        markers: { some: 'markers' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      comment: 'no markers',
      factoryMethod: {
        class: ActionFactory,
        name: 'addAsset',
        parameters: [{ some: 'asset' }]
      },
      expectedAction: {
        type: '[Active Collection] Add Asset',
        asset: { some: 'asset' },
        markers: undefined
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'removeAsset',
        parameters: [{ some: 'asset' }]
      },
      expectedAction: {
        type: '[Active Collection] Remove Asset',
        asset: { some: 'asset' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'updateAssetMarkers',
        parameters: [{ some: 'asset' }, { some: 'markers' }]
      },
      expectedAction: {
        type: '[Active Collection] Update Asset Markers',
        asset: { some: 'asset' },
        markers: { some: 'markers' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'reset',
        parameters: []
      },
      expectedAction: {
        type: '[Active Collection] Reset'
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadSuccess',
        parameters: [{ some: 'collection' }]
      },
      expectedAction: {
        type: '[Active Collection] Load Success',
        activeCollection: { some: 'collection' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'setSuccess',
        parameters: [{ some: 'collection' }]
      },
      expectedAction: {
        type: '[Active Collection] Set Success',
        activeCollection: { some: 'collection' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'loadPageSuccess',
        parameters: [{ some: 'assets' }]
      },
      expectedAction: {
        type: '[Active Collection] Load Page Success',
        currentPageItems: { some: 'assets' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'addAssetSuccess',
        parameters: [{ some: 'assets' }]
      },
      expectedAction: {
        type: '[Active Collection] Add Asset Success',
        currentPageItems: { some: 'assets' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'removeAssetSuccess',
        parameters: [{ some: 'assets' }]
      },
      expectedAction: {
        type: '[Active Collection] Remove Asset Success',
        currentPageItems: { some: 'assets' }
      }
    });

    storeSpecHelper.runStandardActionTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'updateAssetMarkersSuccess',
        parameters: [{ some: 'assets' }]
      },
      expectedAction: {
        type: '[Active Collection] Update Asset Markers Success',
        currentPageItems: { some: 'assets' }
      }
    });
  });
}
