import { Observable } from 'rxjs/Observable';

import * as ActiveCollectionState from './active-collection.state';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { Collection } from '../../shared/interfaces/collection.interface';
import { addFutureStandardReducerTestsFor } from '../../shared/tests/reducer';

export function main() {
  xdescribe('Active Collection Reducer', () => {
    describe('for ActiveCollectionActions.Reset', () => {
      const tempCurrentState = JSON.parse(JSON.stringify(ActiveCollectionState.initialState));
      tempCurrentState.collection.assets.items = [{ assetId: 10836, uuid: '123' }];

      addFutureStandardReducerTestsFor(
        ActiveCollectionState.reducer, ActiveCollectionActions.Reset.Type, ActiveCollectionState.initialState, null,
        tempCurrentState
      );

      it('ignores payload and returns initial state when current state is passed in', () => {
        expect(ActiveCollectionState.reducer(
          { property1: 'existing1', property2: 'existing2' } as any,
          new ActiveCollectionActions.Reset()
        )).toEqual(ActiveCollectionState.initialState);
      });

      it('ignores payload and returns initial state when current state is not passed in', () => {
        expect(ActiveCollectionState.reducer(
          undefined,
          new ActiveCollectionActions.Reset()
        )).toEqual(ActiveCollectionState.initialState);
      });
    });

    describe('for ActiveCollectionActions.AddAsset', () => {
      addFutureStandardReducerTestsFor(
        ActiveCollectionState.reducer, ActiveCollectionActions.AddAsset.Type, ActiveCollectionState.initialState
      );

      it('returns current state plus the new asset payload when current state is passed in', () => {
        expect(ActiveCollectionState.reducer(
          {
            loaded: true,
            collection: {
              assets: { pagination: { totalCount: 1 }, items: [{ some: 'item1' }] }, assetsCount: 1
            }
          } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item2' } as any)
        )).toEqual({
          loaded: true,
          collection: {
            assets: { pagination: { totalCount: 2 }, items: [{ some: 'item2' }, { some: 'item1' }] }, assetsCount: 2
          }
        });
      });

      it('properly adds the first asset', () => {
        expect(ActiveCollectionState.reducer(
          {
            loaded: true,
            collection: {
              assets: { pagination: { totalCount: 0 }, items: [] }, assetsCount: 0
            }
          } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toEqual({
          loaded: true,
          collection: { assets: { pagination: { totalCount: 1 }, items: [{ some: 'item1' }] }, assetsCount: 1 }
        });
      });

      it('throws an exception when current state is passed in with assets undefined', () => {
        expect(() => ActiveCollectionState.reducer(
          {} as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toThrowError();
      });

      it('throws an exception when current state is passed in with items undefined', () => {
        expect(() => ActiveCollectionState.reducer(
          { collection: { assets: { pagination: { totalCount: 1 } } } } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toThrowError();
      });

      it('throws an exception when current state is passed in with pagination undefined', () => {
        expect(() => ActiveCollectionState.reducer(
          { collection: { assets: { items: [{ some: 'item1' }] } } } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toThrowError();
      });

      it('returns initial state plus the new asset payload when current state is not passed in', () => {
        const expectedState = JSON.parse(JSON.stringify(ActiveCollectionState.initialState));
        expectedState.collection.assets.pagination.totalCount = 1;
        expectedState.collection.assets.items = [{ assetId: 10836, uuid: 'blah' }];
        expectedState.collection.assetsCount = 1;

        expect(ActiveCollectionState.reducer(
          undefined,
          new ActiveCollectionActions.AddAsset({ assetId: 10836, uuid: 'blah' } as any)
        )).toEqual(expectedState);
      });
    });

    describe('for ActiveCollectionActions.RemoveAsset', () => {
      const tempCurrentState = JSON.parse(JSON.stringify(ActiveCollectionState.initialState));
      tempCurrentState.collection.assets.items = [{ assetId: 10836, uuid: '123' }];
      const tempPayload = { assetId: 10836, uuid: '123' };

      addFutureStandardReducerTestsFor(
        ActiveCollectionState.reducer, ActiveCollectionActions.RemoveAsset.Type, ActiveCollectionState.initialState, tempPayload,
        tempCurrentState
      );

      it('returns current state minus the specified asset payload when current state is passed in', () => {
        expect(ActiveCollectionState.reducer(
          {
            loaded: true,
            collection: {
              assets: {
                items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }],
                pagination: { totalCount: 2 }
              },
              assetsCount: 2
            }
          } as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 42, uuid: 't123' } as any)
        )).toEqual({
          loaded: true,
          collection: {
            assets: {
              items: [{ assetId: 47, uuid: 't456' }],
              pagination: { totalCount: 1 }
            },
            assetsCount: 1
          },
        });
      });

      it('returns current state when current state is passed in and specified asset payload is not present', () => {
        expect(ActiveCollectionState.reducer(
          {
            loaded: true,
            collection: {
              assets: {
                items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }],
                pagination: { totalCount: 2 }
              },
              assetsCount: 2
            }
          } as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86, uuid: 't789' } as any)
        )).toEqual({
          loaded: true,
          collection: {
            assets: {
              items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }],
              pagination: { totalCount: 2 }
            },
            assetsCount: 2
          }
        });
      });

      it('returns current state when current state is passed in with assets undefined', () => {
        expect(ActiveCollectionState.reducer(
          {} as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86 } as any)
        )).toEqual({});
      });

      it('returns current state when current state is passed in with items undefined', () => {
        expect(ActiveCollectionState.reducer(
          { collection: { assets: {} } } as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86 } as any)
        )).toEqual({ collection: { assets: {} } });
      });

      it('ignores payload and returns initial state when state is not passed in', () => {
        expect(ActiveCollectionState.reducer(
          undefined,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86 } as any)
        )).toEqual(ActiveCollectionState.initialState);
      });
    });

    describe('for ActiveCollectionActions.UpdateAssetMarkers', () => {
      const tempCurrentState = JSON.parse(JSON.stringify(ActiveCollectionState.initialState));
      tempCurrentState.collection.assets.items = [{ assetId: 10836, uuid: '123' }];
      const tempPayload = { assetId: 10836, uuid: '123', timeStart: '1234', timeEnd: '5678' };

      addFutureStandardReducerTestsFor(
        ActiveCollectionState.reducer, ActiveCollectionActions.UpdateAssetMarkers.Type, ActiveCollectionState.initialState,
        tempPayload, tempCurrentState
      );

      it('returns current state with an updated asset when current state is passed in', () => {
        // expect(ActiveCollectionState.reducer(
        //   {
        //     loaded: true,
        //     collection: {
        //       assets: {
        //         items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }],
        //         pagination: { totalCount: 2 }
        //       },
        //       assetsCount: 2
        //     }
        //   } as any,
        //   new ActiveCollectionActions.UpdateAssetMarkers({ assetId: 42, uuid: 't123', timeStart: '1234', timeEnd: '5678' })
        // )).toEqual({
        //   loaded: true,
        //   collection: {
        //     assets: {
        //       items: [{ assetId: 42, uuid: 't123', timeStart: 1234, timeEnd: 5678 }, { assetId: 47, uuid: 't456' }],
        //       pagination: { totalCount: 2 }
        //     },
        //     assetsCount: 2
        //   }
        // });
      });

      it('returns current state when current state is passed in and specified asset payload is not present', () => {
        expect(ActiveCollectionState.reducer(
          {
            loaded: true,
            collection: {
              assets: {
                items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }],
                pagination: { totalCount: 2 }
              },
              assetsCount: 2
            }
          } as any,
          new ActiveCollectionActions.UpdateAssetMarkers({
            asset: { assetId: 86, uuid: 't789' } as any,
            markers: { in: { some: 'frame' } as any, out: { other: 'frame' } as any }
          })
        )).toEqual({
          loaded: true,
          collection: {
            assets: {
              items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }],
              pagination: { totalCount: 2 }
            },
            assetsCount: 2
          }
        });
      });

      it('returns current state when current state is passed in with assets undefined', () => {
        // expect(ActiveCollectionState.reducer(
        //   {} as any,
        //   new ActiveCollectionActions.UpdateAssetMarkers({ assetId: 86, uuid: 't456', timeStart: '1234', timeEnd: '5678' })
        // )).toEqual({});
      });

      it('returns current state when current state is passed in with items undefined', () => {
        // expect(ActiveCollectionState.reducer(
        //   { collection: { assets: {} } } as any,
        //   new ActiveCollectionActions.UpdateAssetMarkers({ assetId: 86, uuid: 't456', timeStart: '1234', timeEnd: '5678' })
        // )).toEqual({ collection: { assets: {} } });
      });

      it('ignores payload and returns initial state when state is not passed in', () => {
        // expect(ActiveCollectionState.reducer(
        //   undefined,
        //   new ActiveCollectionActions.UpdateAssetMarkers({ assetId: 86, uuid: 't456', timeStart: '1234', timeEnd: '5678' })
        // )).toEqual(ActiveCollectionState.initialState);
      });
    });

    describe('Unexpected action type', () => {
      it('returns the current state when current state is passed in', () => {
        expect(ActiveCollectionState.reducer(
          { current: 'state' } as any,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual({ current: 'state' });
      });

      it('returns the initial state when state is not passed in', () => {
        expect(ActiveCollectionState.reducer(
          undefined,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual(ActiveCollectionState.initialState);
      });
    });
  });
}
