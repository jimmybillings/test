import { features, FeatureStore } from './feature.store';
import { Feature } from '../interfaces/feature.interface';
import { Observable } from 'rxjs/Rx';

export function main() {
  const initState: any = {
    disableCartAccess: false,
    disableCollectionAccess: false
  };

  describe('features reducer', () => {
    it('returns the payload for FEATURE.SET_STATE', () => {
      expect(features(initState, { type: 'FEATURE.SET_STATE', payload: { key: 'value' } }))
        .toEqual({
          disableCartAccess: false,
          disableCollectionAccess: false,
          key: 'value'
        });
    });

    it('returns the current state for an unexpected action type', () => {
      expect(features(initState, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual(initState);
    });

    it('returns the default state for no current state and an unexpected action type', () => {
      expect(features(undefined, { type: 'BLAH', payload: { someKey: 'someValue' } }))
        .toEqual(initState);
    });
  });

  describe('Feature Store', () => {
    let storeUnderTest: FeatureStore, mockStore: any;

    beforeEach(() => {
      mockStore = {
        dispatch: jasmine.createSpy('dispatch'),
        select: jasmine.createSpy('select').and.returnValue(Observable.of(initState))
      };
      storeUnderTest = new FeatureStore(mockStore);
    });

    describe('isAvailable', () => {
      it('should return true if the feature is not disabled', () => {
        expect(storeUnderTest.isAvailable(Feature.disableCartAccess)).toBe(true);
      });
    });

    describe('set', () => {
      it('should call dispatch on the store with the right action', () => {
        storeUnderTest.set({ disableCartAccess: 'true' });

        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'FEATURE.SET_STATE', payload: { disableCartAccess: true } });
      });
    });
  });
}
