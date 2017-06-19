import * as AssetStore from './asset.store';
import * as AssetActions from '../actions/asset.actions';
import { addFutureStandardReducerTestsFor } from '../tests/reducer';

export function main() {
  describe('Asset Reducer', () => {
    describe('for AssetActions.LOAD', () => {
      const tempCurrentState = { currentAsset: { assetId: 123, name: 'George' }, loaded: true };

      addFutureStandardReducerTestsFor(AssetStore.reducer, AssetActions.LOAD, AssetStore.initialState, null, tempCurrentState);

      it('returns initialState when current state is passed in', () => {
        expect(AssetStore.reducer(
          { currentAsset: { assetId: 123, name: 'fred' }, loaded: true },
          new AssetActions.Load({} as any)
        )).toEqual(AssetStore.initialState);
      });

      it('returns initialState when current state is not passed in', () => {
        expect(AssetStore.reducer(
          undefined, new AssetActions.Load({} as any)
        )).toEqual(AssetStore.initialState);
      });
    });

    describe('for AssetActions.LOAD_SUCCESS', () => {
      addFutureStandardReducerTestsFor(AssetStore.reducer, AssetActions.LOAD_SUCCESS, AssetStore.initialState);

      it('returns an updated state when current state is passed in', () => {
        expect(AssetStore.reducer(
          { currentAsset: { assetId: 123, name: 'fred' }, loaded: true },
          new AssetActions.LoadSuccess({ some: 'asset' } as any)
        )).toEqual({ currentAsset: { some: 'asset' }, loaded: true });
      });

      it('returns an updated state when current state is not passed in', () => {
        expect(AssetStore.reducer(
          undefined,
          new AssetActions.LoadSuccess({ some: 'asset' } as any)
        )).toEqual({ currentAsset: { some: 'asset' }, loaded: true });
      });
    });

    describe('Unexpected action type', () => {
      it('returns the current state when current state is passed in', () => {
        expect(AssetStore.reducer(
          { current: 'state' } as any,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual({ current: 'state' });
      });

      it('returns the initial state when current state is not passed in', () => {
        expect(AssetStore.reducer(
          undefined,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual(AssetStore.initialState);
      });
    });
  });
}
