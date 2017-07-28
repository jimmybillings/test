import * as AssetState from './asset.state';
import * as AssetActions from '../actions/asset.actions';
import { addFutureStandardReducerTestsFor } from '../../shared/tests/reducer';

export function main() {
  describe('Asset Reducer', () => {
    describe('for AssetActions.Load', () => {
      const tempCurrentState = { currentAsset: { assetId: 123, name: 'George' }, loaded: true };

      addFutureStandardReducerTestsFor(
        AssetState.reducer, AssetActions.Load.Type, AssetState.initialState, null, tempCurrentState
      );

      it('returns current state but with loaded: false when current state is passed in', () => {
        expect(AssetState.reducer(
          { currentAsset: { assetId: 123, name: 'fred' }, loaded: true },
          new AssetActions.Load({} as any)
        )).toEqual({ currentAsset: { assetId: 123, name: 'fred' }, loaded: false });
      });

      it('returns initialState when current state is not passed in', () => {
        expect(AssetState.reducer(
          undefined, new AssetActions.Load({} as any)
        )).toEqual(AssetState.initialState);
      });
    });

    describe('for AssetActions.LoadSuccess', () => {
      addFutureStandardReducerTestsFor(AssetState.reducer, AssetActions.LoadSuccess.Type, AssetState.initialState);

      it('returns an updated state when current state is passed in', () => {
        expect(AssetState.reducer(
          { currentAsset: { assetId: 123, name: 'fred' }, loaded: true },
          new AssetActions.LoadSuccess({ some: 'asset' } as any)
        )).toEqual({ currentAsset: { some: 'asset' }, loaded: true });
      });

      it('returns an updated state when current state is not passed in', () => {
        expect(AssetState.reducer(
          undefined,
          new AssetActions.LoadSuccess({ some: 'asset' } as any)
        )).toEqual({ currentAsset: { some: 'asset' }, loaded: true });
      });
    });

    describe('Unexpected action type', () => {
      it('returns the current state when current state is passed in', () => {
        expect(AssetState.reducer(
          { current: 'state' } as any,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual({ current: 'state' });
      });

      it('returns the initial state when current state is not passed in', () => {
        expect(AssetState.reducer(
          undefined,
          { type: 'BLAH', payload: { someKey: 'someValue' } } as any
        )).toEqual(AssetState.initialState);
      });
    });
  });
}
