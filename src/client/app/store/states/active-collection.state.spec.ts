import { Observable } from 'rxjs/Observable';

import * as ActiveCollectionState from './active-collection.state';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { Collection } from '../../shared/interfaces/collection.interface';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Active Collection Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: ActiveCollectionActions,
      state: ActiveCollectionState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['Load', 'Set', 'LoadPage', 'UpdateAssetMarkers'],
      mutationTestData: {
        previousState: { loading: false }
      },
      customTests: [
        {
          it: 'with previous state, returns previous state but with loading: true',
          previousState: { some: 'stuff', loading: false },
          expectedNextState: { some: 'stuff', loading: true }
        },
        {
          it: 'without previous state, returns initial state but with loading: true',
          expectedNextState: { ...ActiveCollectionState.initialState, loading: true }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['LoadSuccess', 'SetSuccess'],
      customTests: [
        {
          it: 'with previous state, returns initial state but with new collection and loading: false',
          previousState: { some: 'stuff', collection: 'previous', loading: true },
          actionParameters: { activeCollection: 'new' },
          expectedNextState: { ...ActiveCollectionState.initialState, collection: 'new', loading: false }
        },
        {
          it: 'without previous state, returns initial state but with new collection and loading: false',
          actionParameters: { activeCollection: 'new' },
          expectedNextState: { ...ActiveCollectionState.initialState, collection: 'new', loading: false }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['LoadPageSuccess', 'UpdateAssetMarkersSuccess'],
      customTests: [
        {
          it: 'with previous state, returns previous state but with new page items and loading: false',
          previousState: { some: 'stuff', collection: { some: 'collectionStuff', assets: 'previous' }, loading: true },
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: { some: 'stuff', collection: { some: 'collectionStuff', assets: 'new' }, loading: false }
        },
        {
          it: 'without previous state, returns initial state but with new page items and loading: false',
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            collection: { ...ActiveCollectionState.initialState.collection, assets: 'new' },
            loading: false
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'AddAsset',
      customTests: [
        {
          it: 'with previous state and markers, returns previous state but with latest addition and loading: true',
          previousState: { some: 'stuff', loading: false },
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
            loading: true
          }
        },
        {
          it: 'with previous state and no markers, returns previous state but with latest addition and loading: true',
          previousState: { some: 'stuff', loading: false },
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: { some: 'stuff', latestAddition: { asset: { some: 'asset' } }, loading: true }
        },
        {
          it: 'without previous state and with markers, returns initial state but with latest addition and loading: true',
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
            loading: true
          }
        },
        {
          it: 'without previous state and no markers, returns initial state but with latest addition and loading: true',
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            latestAddition: { asset: { some: 'asset' } },
            loading: true
          }
        },
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'AddAssetSuccess',
      customTests: [
        {
          it: 'with previous state, returns previous state but with asset updates and loading: false',
          previousState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'previous', assetsCount: 99 },
            loading: true
          },
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'new', assetsCount: 100 },
            loading: false
          }
        },
        {
          it: 'without previous state, returns initial state but with asset updates and loading: false',
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            collection: { ...ActiveCollectionState.initialState.collection, assets: 'new', assetsCount: 1 },
            loading: false
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'RemoveAsset',
      customTests: [
        {
          it: 'with previous state, returns previous state but with latest removal and loading: true',
          previousState: {
            some: 'stuff',
            loading: false
          },
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: {
            some: 'stuff',
            latestRemoval: { some: 'asset' },
            loading: true
          }
        },
        {
          it: 'without previous state, returns initial state but with latest removal and loading: true',
          actionParameters: { asset: { some: 'asset' } },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            latestRemoval: { some: 'asset' },
            loading: true
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'RemoveAssetSuccess',
      customTests: [
        {
          it: 'with previous state, returns previous state but with asset updates and loading: false',
          previousState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'previous', assetsCount: 99 },
            loading: true
          },
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            some: 'stuff',
            collection: { some: 'collectionStuff', assets: 'new', assetsCount: 98 },
            loading: false
          }
        },
        {
          it: 'without previous state, returns initial state but with asset updates and loading: false',
          actionParameters: { currentPageItems: 'new' },
          expectedNextState: {
            ...ActiveCollectionState.initialState,
            collection: { ...ActiveCollectionState.initialState.collection, assets: 'new', assetsCount: -1 },
            loading: false
          }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: 'Reset',
      mutationTestData: {
        previousState: { loading: false }
      },
      customTests: [
        {
          it: 'with previous state, returns initial state',
          previousState: { some: 'stuff', loading: true },
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
