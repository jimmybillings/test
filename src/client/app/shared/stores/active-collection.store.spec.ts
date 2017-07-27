import { Observable } from 'rxjs/Observable';

import { activeCollection, ActiveCollectionStore } from './active-collection.store';
import { Collection } from '../interfaces/collection.interface';
import { addStandardReducerTestsFor } from '../tests/reducer';

export function main() {
  describe('Active Collection reducer', () => {
    let initialState: Collection = {
      createdOn: null,
      lastUpdated: null,
      id: null,
      siteName: '',
      name: '',
      owner: 0,
      email: '',
      userRole: '',
      editors: [],
      collectionThumbnail: {} as { name: string, urls: { https: string } },
      assets: {
        items: [],
        pagination: {
          totalCount: 0,
          currentPage: 1,
          pageSize: 100,
          hasNextPage: false,
          hasPreviousPage: false,
          numberOfPages: 0
        },
      },
      tags: [],
      assetsCount: 0
    };

    describe('UPDATE_ACTIVE_COLLECTION', () => {
      addStandardReducerTestsFor(activeCollection, 'UPDATE_ACTIVE_COLLECTION', initialState);

      it('returns current state merged with payload when current state is passed in', () => {
        expect(activeCollection(
          { property1: 'existing1', property2: 'existing2' } as any,
          { type: 'UPDATE_ACTIVE_COLLECTION', payload: { property1: 'new', other: 'stuff' } }
        ))
          .toEqual({ property1: 'new', property2: 'existing2', other: 'stuff', assetsCount: 0 });
      });

      it('returns initial state merged with payload when current state is not passed in', () => {
        const expectedResult = JSON.parse(JSON.stringify(initialState));
        expectedResult.name = 'Fred';

        expect(activeCollection(undefined, { type: 'UPDATE_ACTIVE_COLLECTION', payload: { name: 'Fred' } }))
          .toEqual(expectedResult);
      });
    });

    describe('RESET_ACTIVE_COLLECTION', () => {
      addStandardReducerTestsFor(activeCollection, 'RESET_ACTIVE_COLLECTION', initialState);

      it('ignores payload and returns initial state when current state is passed in', () => {
        expect(activeCollection(
          { property1: 'existing1', property2: 'existing2' } as any,
          { type: 'RESET_ACTIVE_COLLECTION', payload: { property1: 'new', other: 'stuff' } }
        ))
          .toEqual(initialState);
      });

      it('ignores payload and returns initial state when current state is not passed in', () => {
        expect(activeCollection(
          undefined,
          { type: 'RESET_ACTIVE_COLLECTION', payload: { property1: 'new', other: 'stuff' } }
        ))
          .toEqual(initialState);
      });
    });

    describe('ADD_ASSET_TO_COLLECTION', () => {
      addStandardReducerTestsFor(activeCollection, 'ADD_ASSET_TO_COLLECTION', initialState);

      it('returns current state plus the new asset payload when current state is passed in', () => {
        expect(activeCollection(
          { assets: { items: [{ some: 'item1' }] }, assetsCount: 1 } as any,
          { type: 'ADD_ASSET_TO_COLLECTION', payload: { some: 'item2' } }
        ))
          .toEqual({ assets: { items: [{ some: 'item2' }, { some: 'item1' }] }, assetsCount: 2 });
      });

      it('returns current state plus the new asset payload when current state is passed in with assets undefined', () => {
        expect(activeCollection({} as any, { type: 'ADD_ASSET_TO_COLLECTION', payload: { some: 'item1' } }))
          .toEqual({ assets: { items: [{ some: 'item1' }] }, assetsCount: 1 });
      });

      it('returns current state plus the new asset payload when current state is passed in with items undefined', () => {
        expect(activeCollection({ assets: {} } as any, { type: 'ADD_ASSET_TO_COLLECTION', payload: { some: 'item1' } }))
          .toEqual({ assets: { items: [{ some: 'item1' }] }, assetsCount: 1 });
      });

      it('returns initial state plus the new asset payload when current state is not passed in', () => {
        const expectedResult = JSON.parse(JSON.stringify(initialState));
        expectedResult.assets.items = [{ assetId: 10836, uuid: 'blah' }];
        expectedResult.assetsCount = 1;

        expect(activeCollection(undefined, { type: 'ADD_ASSET_TO_COLLECTION', payload: { assetId: 10836, uuid: 'blah' } }))
          .toEqual(expectedResult);
      });
    });

    describe('REMOVE_ASSET_FROM_COLLECTION', () => {
      const tempInitialState = JSON.parse(JSON.stringify(initialState));
      tempInitialState.assets.items = [{ assetId: 10836, uuid: '123' }];
      const tempPayload = { assetId: 10836, uuid: '123' };

      addStandardReducerTestsFor(activeCollection, 'REMOVE_ASSET_FROM_COLLECTION', tempInitialState, tempPayload);

      it('returns current state minus the specified asset payload when current state is passed in', () => {
        expect(activeCollection(
          {
            assets: {
              pagination: { totalCount: 2 }, items: [{ assetId: 42, uuid: 't123' },
              { assetId: 47, uuid: 't456' }]
            }, assetsCount: 2
          } as any,
          { type: 'REMOVE_ASSET_FROM_COLLECTION', payload: 't123' }
        ))
          .toEqual({ assets: { pagination: { totalCount: 1 }, items: [{ assetId: 47, uuid: 't456' }] }, assetsCount: 1 });
      });

      it('returns current state when current state is passed in and specified asset payload is not present', () => {
        expect(activeCollection(
          {
            assets: {
              pagination: { totalCount: 2 }, items: [{ assetId: 42, uuid: 't123' },
              { assetId: 47, uuid: 't456' }]
            }, assetsCount: 2
          } as any,
          { type: 'REMOVE_ASSET_FROM_COLLECTION', payload: { assetId: 86, uuid: 't789' } }
        ))
          .toEqual({
            assets: {
              pagination: { totalCount: 1 }, items: [{ assetId: 42, uuid: 't123' },
              { assetId: 47, uuid: 't456' }]
            }, assetsCount: 1
          });
      });

      it('returns current state when current state is passed in with assets undefined', () => {
        expect(activeCollection(
          {} as any,
          { type: 'REMOVE_ASSET_FROM_COLLECTION', payload: { assetId: 86 } }
        ))
          .toEqual({});
      });

      it('returns current state when current state is passed in with items undefined', () => {
        expect(activeCollection(
          { assets: {} } as any,
          { type: 'REMOVE_ASSET_FROM_COLLECTION', payload: { assetId: 86 } }
        ))
          .toEqual({ assets: {} });
      });

      it('ignores payload and returns initial state when state is not passed in', () => {
        expect(activeCollection(undefined, { type: 'REMOVE_ASSET_FROM_COLLECTION', payload: { assetId: 86 } }))
          .toEqual(initialState);
      });
    });

    describe('Unexpected action type', () => {
      it('returns the current state when current state is passed in', () => {
        expect(activeCollection({ current: 'state' } as any, { type: 'BLAH', payload: { someKey: 'someValue' } }))
          .toEqual({ current: 'state' });
      });

      it('returns the initial state when state is not passed in', () => {
        expect(activeCollection(undefined, { type: 'BLAH', payload: { someKey: 'someValue' } }))
          .toEqual(initialState);
      });
    });
  });

  describe('Active Collection Store', () => {
    let mockStore: any;
    let storeUnderTest: ActiveCollectionStore;

    beforeEach(() => {
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of({ someKey: 'someValue' })),
        dispatch: jasmine.createSpy('dispatch')
      };
      storeUnderTest = new ActiveCollectionStore(mockStore);
    });

    describe('data getter', () => {
      it('accesses the right part of the global store', () => {
        storeUnderTest.data.subscribe();
        expect(mockStore.select).toHaveBeenCalledWith('activeCollection');
      });

      it('returns the expected data', () => {
        storeUnderTest.data.subscribe(data => {
          expect(data).toEqual({ someKey: 'someValue' });
        });
      });
    });

    describe('add()', () => {
      it('dispatches ADD_ASSET_TO_COLLECTION with the passed-in asset', () => {
        storeUnderTest.add({ some: 'asset' });

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'ADD_ASSET_TO_COLLECTION', payload: { some: 'asset' } });
      });
    });

    describe('remove()', () => {
      it('dispatches REMOVE_ASSET_FROM_COLLECTION with the passed-in asset', () => {
        storeUnderTest.remove('asset');

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'REMOVE_ASSET_FROM_COLLECTION', payload: 'asset' });
      });
    });

    describe('updateTo()', () => {
      it('dispatches UPDATE_ACTIVE_COLLECTION with a default collection when no collection is passed in', () => {
        storeUnderTest.updateTo({} as Collection);

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({
            type: 'UPDATE_ACTIVE_COLLECTION',
            payload: {
              createdOn: null,
              lastUpdated: null,
              id: null,
              siteName: '',
              name: '',
              owner: 0,
              email: '',
              userRole: '',
              editors: [],
              collectionThumbnail: {},
              tags: [],
              assetsCount: 0
            }
          });
      });

      it('dispatches UPDATE_ACTIVE_COLLECTION with an edited version of the passed-in collection', () => {
        const newCollection: Collection = {
          createdOn: null,
          lastUpdated: null,
          id: 10836,
          siteName: 'some sitename',
          name: 'some name',
          owner: 42,
          email: 'some email',
          userRole: 'some userRole',
          editors: [18, 7],
          collectionThumbnail: {
            name: 'some thumbnail name',
            urls: {
              https: 'some URL'
            }
          },
          tags: [],
          assetsCount: 2,
          assets: {
            items: [
              { assetId: 17, uuid: 'some UUID', name: '' },
              { assetId: 33, uuid: 'some other UUID', name: '' }
            ]
          }
        };

        const expectedPayload = JSON.parse(JSON.stringify(newCollection));
        delete expectedPayload.assets; // Because we don't expect assets to be in the payload.

        storeUnderTest.updateTo(newCollection);

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'UPDATE_ACTIVE_COLLECTION', payload: expectedPayload });
      });
    });

    describe('reset()', () => {
      it('should dispatch RESET_ACTIVE_COLLECTION', () => {
        storeUnderTest.reset();

        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'RESET_ACTIVE_COLLECTION' });
      });
    });

    describe('updateAssetsTo()', () => {
      it('dispatches UPDATE_ACTIVE_COLLECTION with the passed-in assets', () => {
        storeUnderTest.updateAssetsTo({
          items: ['item1', 'item2'],
          totalCount: 2,
          currentPage: 98,
          pageSize: 103,
          hasNextPage: true,
          hasPreviousPage: true,
          numberOfPages: 200
        });

        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: 'UPDATE_ACTIVE_COLLECTION',
          payload: {
            assets: {
              items: ['item1', 'item2'],
              pagination: {
                totalCount: 2,
                currentPage: 99,
                pageSize: 103,
                hasNextPage: true,
                hasPreviousPage: true,
                numberOfPages: 200
              }
            }
          }
        });
      });

      it('handles passed-in assets with a missing items array', () => {
        storeUnderTest.updateAssetsTo({
          totalCount: 2,
          currentPage: 98,
          pageSize: 103,
          hasNextPage: true,
          hasPreviousPage: true,
          numberOfPages: 200
        });

        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: 'UPDATE_ACTIVE_COLLECTION',
          payload: {
            assets: {
              items: [],
              pagination: {
                totalCount: 2,
                currentPage: 99,
                pageSize: 103,
                hasNextPage: true,
                hasPreviousPage: true,
                numberOfPages: 200
              }
            }
          }
        });
      });

      it('dispatches with a mostly undefined payload when an empty object is passed in', () => {
        const expectedPayloadAssets: any = {
          items: [],
          pagination: {
            totalCount: undefined,
            currentPage: NaN,
            pageSize: undefined,
            hasNextPage: undefined,
            hasPreviousPage: undefined,
            numberOfPages: undefined
          }
        };

        storeUnderTest.updateAssetsTo({});

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'UPDATE_ACTIVE_COLLECTION', payload: { assets: expectedPayloadAssets } });
      });

      it('dispatches with a mostly undefined payload when null is passed in', () => {
        const expectedPayloadAssets: any = {
          items: [],
          pagination: {
            totalCount: undefined,
            currentPage: NaN,
            pageSize: undefined,
            hasNextPage: undefined,
            hasPreviousPage: undefined,
            numberOfPages: undefined
          }
        };

        storeUnderTest.updateAssetsTo(null);

        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'UPDATE_ACTIVE_COLLECTION', payload: { assets: expectedPayloadAssets } });
      });
    });

    describe('state()', () => {
      it('returns the current store state', () => {
        expect(storeUnderTest.state).toEqual({ someKey: 'someValue' });
      });
    });
  });
}
