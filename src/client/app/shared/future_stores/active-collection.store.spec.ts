import { Observable } from 'rxjs/Observable';

import * as ActiveCollectionStore from './active-collection.store';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { Collection } from '../interfaces/collection.interface';
import { addFutureStandardReducerTestsFor } from '../tests/reducer';

export function main() {
  describe('Active Collection Reducer', () => {
    describe('for ActiveCollectionActions.UPDATE', () => {
      addFutureStandardReducerTestsFor(
        ActiveCollectionStore.reducer, ActiveCollectionActions.UPDATE, ActiveCollectionStore.initialState
      );

      it('returns current state merged with payload when current state is passed in', () => {
        expect(ActiveCollectionStore.reducer(
          { property1: 'existing1', property2: 'existing2' } as any,
          new ActiveCollectionActions.Update({ property1: 'new', other: 'stuff' } as any)
        )).toEqual({ property1: 'new', property2: 'existing2', other: 'stuff', assetsCount: 0 });
      });

      it('does not update assetCount if payload assets do not contain pagination information', () => {
        expect(ActiveCollectionStore.reducer(
          { property1: 'existing1', property2: 'existing2' } as any,
          new ActiveCollectionActions.Update({ property1: 'new', other: 'stuff', assets: {} } as any)
        )).toEqual({ property1: 'new', property2: 'existing2', other: 'stuff', assets: {}, assetsCount: 0 });
      });

      it('updates assetCount if payload assets contains pagination information', () => {
        expect(ActiveCollectionStore.reducer(
          { property1: 'existing1', property2: 'existing2' } as any,
          new ActiveCollectionActions.Update({
            property1: 'new', other: 'stuff', assets: { pagination: { totalCount: 42 } }
          } as any)
        )).toEqual({
          property1: 'new', property2: 'existing2', other: 'stuff', assets: { pagination: { totalCount: 42 } }, assetsCount: 42
        });
      });

      it('returns initial state merged with payload when current state is not passed in', () => {
        const expectedResult = JSON.parse(JSON.stringify(ActiveCollectionStore.initialState));
        expectedResult.name = 'Fred';

        expect(ActiveCollectionStore.reducer(
          undefined,
          new ActiveCollectionActions.Update({ name: 'Fred' } as any)
        )).toEqual(expectedResult);
      });
    });

    describe('for ActiveCollectionActions.RESET', () => {
      const tempCurrentState = JSON.parse(JSON.stringify(ActiveCollectionStore.initialState));
      tempCurrentState.assets.items = [{ assetId: 10836, uuid: '123' }];

      addFutureStandardReducerTestsFor(
        ActiveCollectionStore.reducer, ActiveCollectionActions.RESET, ActiveCollectionStore.initialState, null, tempCurrentState
      );

      it('ignores payload and returns initial state when current state is passed in', () => {
        expect(ActiveCollectionStore.reducer(
          { property1: 'existing1', property2: 'existing2' } as any,
          new ActiveCollectionActions.Reset()
        )).toEqual(ActiveCollectionStore.initialState);
      });

      it('ignores payload and returns initial state when current state is not passed in', () => {
        expect(ActiveCollectionStore.reducer(
          undefined,
          new ActiveCollectionActions.Reset()
        )).toEqual(ActiveCollectionStore.initialState);
      });
    });

    describe('for ActiveCollectionActions.ADD_ASSET', () => {
      addFutureStandardReducerTestsFor(
        ActiveCollectionStore.reducer, ActiveCollectionActions.ADD_ASSET, ActiveCollectionStore.initialState
      );

      it('returns current state plus the new asset payload when current state is passed in', () => {
        expect(ActiveCollectionStore.reducer(
          { assets: { pagination: { totalCount: 1 }, items: [{ some: 'item1' }] }, assetsCount: 1 } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item2' } as any)
        )).toEqual({ assets: { pagination: { totalCount: 2 }, items: [{ some: 'item2' }, { some: 'item1' }] }, assetsCount: 2 });
      });

      it('properly adds the first asset', () => {
        expect(ActiveCollectionStore.reducer(
          { assets: { pagination: { totalCount: 0 }, items: [] }, assetsCount: 0 } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toEqual({ assets: { pagination: { totalCount: 1 }, items: [{ some: 'item1' }] }, assetsCount: 1 });
      });

      it('throws an exception when current state is passed in with assets undefined', () => {
        expect(() => ActiveCollectionStore.reducer(
          {} as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toThrowError();
      });

      it('throws an exception when current state is passed in with items undefined', () => {
        expect(() => ActiveCollectionStore.reducer(
          { assets: { pagination: { totalCount: 1 } } } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toThrowError();
      });

      it('throws an exception when current state is passed in with pagination undefined', () => {
        expect(() => ActiveCollectionStore.reducer(
          { assets: { items: [{ some: 'item1' }] } } as any,
          new ActiveCollectionActions.AddAsset({ some: 'item1' } as any)
        )).toThrowError();
      });

      it('returns initial state plus the new asset payload when current state is not passed in', () => {
        const expectedState = JSON.parse(JSON.stringify(ActiveCollectionStore.initialState));
        expectedState.assets.pagination.totalCount = 1;
        expectedState.assets.items = [{ assetId: 10836, uuid: 'blah' }];
        expectedState.assetsCount = 1;

        expect(ActiveCollectionStore.reducer(
          undefined,
          new ActiveCollectionActions.AddAsset({ assetId: 10836, uuid: 'blah' } as any)
        )).toEqual(expectedState);
      });
    });

    describe('for ActiveCollectionActions.REMOVE_ASSET', () => {
      const tempCurrentState = JSON.parse(JSON.stringify(ActiveCollectionStore.initialState));
      tempCurrentState.assets.items = [{ assetId: 10836, uuid: '123' }];
      const tempPayload = { assetId: 10836, uuid: '123' };

      addFutureStandardReducerTestsFor(
        ActiveCollectionStore.reducer, ActiveCollectionActions.REMOVE_ASSET, ActiveCollectionStore.initialState, tempPayload,
        tempCurrentState
      );

      it('returns current state minus the specified asset payload when current state is passed in', () => {
        expect(ActiveCollectionStore.reducer(
          {
            assets: {
              pagination: { totalCount: 2 },
              items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }]
            },
            assetsCount: 2
          } as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 42, uuid: 't123' } as any)
        )).toEqual({ assets: { pagination: { totalCount: 1 }, items: [{ assetId: 47, uuid: 't456' }] }, assetsCount: 1 });
      });

      it('returns current state when current state is passed in and specified asset payload is not present', () => {
        expect(ActiveCollectionStore.reducer(
          {
            assets: {
              pagination: { totalCount: 2 },
              items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }]
            },
            assetsCount: 2
          } as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86, uuid: 't789' } as any)
        )).toEqual({
          assets: {
            pagination: { totalCount: 2 },
            items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }]
          },
          assetsCount: 2
        });
      });

      it('returns current state when current state is passed in with assets undefined', () => {
        expect(ActiveCollectionStore.reducer(
          {} as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86 } as any)
        )).toEqual({});
      });

      it('returns current state when current state is passed in with items undefined', () => {
        expect(ActiveCollectionStore.reducer(
          { assets: {} } as any,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86 } as any)
        )).toEqual({ assets: {} });
      });

      it('ignores payload and returns initial state when state is not passed in', () => {
        expect(ActiveCollectionStore.reducer(
          undefined,
          new ActiveCollectionActions.RemoveAsset({ assetId: 86 } as any)
        )).toEqual(ActiveCollectionStore.initialState);
      });
    });

    describe('for ActiveCollectionActions.UPDATE_ASSET_MARKERS', () => {
      const tempCurrentState = JSON.parse(JSON.stringify(ActiveCollectionStore.initialState));
      tempCurrentState.assets.items = [{ assetId: 10836, uuid: '123' }];
      const tempPayload = { assetId: 10836, uuid: '123' };

      addFutureStandardReducerTestsFor(
        ActiveCollectionStore.reducer, ActiveCollectionActions.UPDATE_ASSET_MARKERS, ActiveCollectionStore.initialState,
        tempPayload, tempCurrentState
      );

      it('returns current state with an updated asset when current state is passed in', () => {
        expect(ActiveCollectionStore.reducer(
          {
            assets: {
              pagination: { totalCount: 2 },
              items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }]
            },
            assetsCount: 2
          } as any,
          new ActiveCollectionActions.UpdateAsset({ assetId: 42, uuid: 't123', timeStart: '1234', timeEnd: '5678' })
        )).toEqual({
          assets: {
            pagination: { totalCount: 2 },
            items: [{ assetId: 42, uuid: 't123', timeStart: 1234, timeEnd: 5678 }, { assetId: 47, uuid: 't456' }]
          },
          assetsCount: 2
        });
      });

      it('returns current state when current state is passed in and specified asset payload is not present', () => {
        expect(ActiveCollectionStore.reducer(
          {
            assets: {
              pagination: { totalCount: 2 },
              items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }]
            },
            assetsCount: 2
          } as any,
          new ActiveCollectionActions.UpdateAsset({ assetId: 86, uuid: 't789', timeStart: '1234', timeEnd: '5678' })
        )).toEqual({
          assets: {
            pagination: { totalCount: 2 },
            items: [{ assetId: 42, uuid: 't123' }, { assetId: 47, uuid: 't456' }]
          },
          assetsCount: 2
        });
      });

      it('returns current state when current state is passed in with assets undefined', () => {
        expect(ActiveCollectionStore.reducer(
          {} as any,
          new ActiveCollectionActions.UpdateAsset({ assetId: 86, uuid: 't456', timeStart: '1234', timeEnd: '5678' })
        )).toEqual({});
      });

      it('returns current state when current state is passed in with items undefined', () => {
        expect(ActiveCollectionStore.reducer(
          { assets: {} } as any,
          new ActiveCollectionActions.UpdateAsset({ assetId: 86, uuid: 't456', timeStart: '1234', timeEnd: '5678' })
        )).toEqual({ assets: {} });
      });

      it('ignores payload and returns initial state when state is not passed in', () => {
        expect(ActiveCollectionStore.reducer(
          undefined,
          new ActiveCollectionActions.UpdateAsset({ assetId: 86, uuid: 't456', timeStart: '1234', timeEnd: '5678' })
        )).toEqual(ActiveCollectionStore.initialState);
      });
    });

    describe('Unexpected action type', () => {
      it('returns the current state when current state is passed in', () => {
        expect(ActiveCollectionStore.reducer(
          { current: 'state' } as any,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual({ current: 'state' });
      });

      it('returns the initial state when state is not passed in', () => {
        expect(ActiveCollectionStore.reducer(
          undefined,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual(ActiveCollectionStore.initialState);
      });
    });
  });
}
