import { Observable } from 'rxjs/Observable';

import * as ActiveCollectionState from './active-collection.state';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { Collection } from '../../shared/interfaces/collection.interface';
import { StoreSpecHelper } from '../store.spec-helper';

export function main() {
  const storeSpecHelper: StoreSpecHelper = new StoreSpecHelper();

  describe('Active Collection Reducer', () => {
    storeSpecHelper.setReducerTestModules({
      actions: ActiveCollectionActions,
      state: ActiveCollectionState,
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: ['Load', 'Set', 'LoadPage', 'AddComment', 'UpdateAssetMarkers'],
      mutationTestData: {
        previousState: { loaded: true }
      },
      customTests: [
        {
          it: 'with previous state, returns previous state but with loaded: false',
          previousState: { some: 'stuff', loaded: true },
          expectedNextState: { some: 'stuff', loaded: false }
        },
        {
          it: 'without previous state, returns initial state but with loaded: false',
          expectedNextState: { ...ActiveCollectionState.initialState, loaded: false }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: ['LoadSuccess', 'SetSuccess'],
      customTests: [
        {
          it: 'with previous state, returns initial state but with new collection and loaded: true',
          previousState: { some: 'stuff', collection: 'previous', loaded: false },
          actionParameters: { activeCollection: 'new' },
          expectedNextState: { ...ActiveCollectionState.initialState, collection: 'new', loaded: true }
        },
        {
          it: 'without previous state, returns initial state but with new collection and loaded: true',
          actionParameters: { activeCollection: 'new' },
          expectedNextState: { ...ActiveCollectionState.initialState, collection: 'new', loaded: true }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: ['LoadPageSuccess', 'UpdateAssetMarkersSuccess'],
      customTests: [
        {
          it: 'with previous state, returns previous state but with new page items and loaded: true',
          previousState: { some: 'stuff', collection: { some: 'collectionStuff', assets: 'previous' }, loaded: false },
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: { some: 'stuff', collection: { some: 'collectionStuff', assets: 'new' }, loaded: true }
        },
        {
          it: 'without previous state, returns initial state but with new page items and loaded: true',
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            collection: { ...ActiveCollectionState.initialState.collection, assets: 'new' },
            loaded: true
          }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'AddAsset',
      customTests: [
        {
          it: 'with previous state and markers, returns previous state but with latest addition and loaded: false',
          previousState: { some: 'stuff', loaded: true },
          actionParameters: {
            asset: { some: 'asset' },
            markers: { in: { frameNumber: 123, framesPerSecond: 29.97 }, out: { frameNumber: 456, framesPerSecond: 29.97 } }
          },
          expectedNextState: {
            some: 'stuff',
            latestAddition: {
              asset: { some: 'asset' },
              markers: { in: { frameNumber: 123, framesPerSecond: 29.97 }, out: { frameNumber: 456, framesPerSecond: 29.97 } }
            },
            loaded: false
          }
        },
        {
          it: 'with previous state and no markers, returns previous state but with latest addition and loaded: false',
          previousState: { some: 'stuff', loaded: true },
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: { some: 'stuff', latestAddition: { asset: { some: 'asset' } }, loaded: false }
        },
        {
          it: 'without previous state and with markers, returns initial state but with latest addition and loaded: false',
          actionParameters: {
            asset: { some: 'asset' },
            markers: { in: { frameNumber: 123, framesPerSecond: 29.97 }, out: { frameNumber: 456, framesPerSecond: 29.97 } }
          },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            latestAddition: {
              asset: { some: 'asset' },
              markers: { in: { frameNumber: 123, framesPerSecond: 29.97 }, out: { frameNumber: 456, framesPerSecond: 29.97 } }
            },
            loaded: false
          }
        },
        {
          it: 'without previous state and no markers, returns initial state but with latest addition and loaded: false',
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            latestAddition: { asset: { some: 'asset' } },
            loaded: false
          }
        },
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'AddAssetSuccess',
      customTests: [
        {
          it: 'with previous state, returns previous state but with asset updates and loaded: true',
          previousState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'previous', assetsCount: 99 },
            loaded: false
          },
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'new', assetsCount: 100 },
            loaded: true
          }
        },
        {
          it: 'without previous state, returns initial state but with asset updates and loaded: true',
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            collection: { ...ActiveCollectionState.initialState.collection, assets: 'new', assetsCount: 1 },
            loaded: true
          }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'RemoveAsset',
      customTests: [
        {
          it: 'with previous state, returns previous state but with latest removal and loaded: false',
          previousState: {
            some: 'stuff',
            loaded: true
          },
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: {
            some: 'stuff',
            latestRemoval: { some: 'asset' },
            loaded: false
          }
        },
        {
          it: 'without previous state, returns initial state but with latest removal and loaded: false',
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            latestRemoval: { some: 'asset' },
            loaded: false
          }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'RemoveAssetSuccess',
      customTests: [
        {
          it: 'with previous state, returns previous state but with asset updates and loaded: true',
          previousState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'previous', assetsCount: 99 },
            loaded: false
          },
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'new', assetsCount: 98 },
            loaded: true
          }
        },
        {
          it: 'without previous state, returns initial state but with asset updates and loaded: true',
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            collection: { ...ActiveCollectionState.initialState.collection, assets: 'new', assetsCount: -1 },
            loaded: true
          }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'AddCommentSuccess',
      customTests: [
        {
          it: 'with previous state, returns previously state but with updated comments and loaded: true',
          previousState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', comments: { some: 'old comments' } },
            loaded: false
          },
          actionParameters: { activeCollectionComments: { some: 'updated comments' } },
          expectedNextState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', comments: { some: 'updated comments' } },
            loaded: true
          }
        },
        {
          it: 'without previous state, returns initial state but with updated comments and loaded: true',
          actionParameters: { activeCollectionComments: { some: 'updated comments' } },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            collection: { ...ActiveCollectionState.initialState.collection, comments: { some: 'updated comments' } },
            loaded: true
          }
        }
      ]
    });

    storeSpecHelper.addReducerTestsFor({
      actionClassName: 'Reset',
      mutationTestData: {
        previousState: { loaded: true }
      },
      customTests: [
        {
          it: 'with previous state, returns initial state',
          previousState: { some: 'stuff', loaded: false },
          expectedNextState: ActiveCollectionState.initialState
        },
        {
          it: 'without previous state, returns initial state',
          expectedNextState: ActiveCollectionState.initialState
        }
      ]
    });
  });
}
