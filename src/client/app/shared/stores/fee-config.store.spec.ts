import { Observable } from 'rxjs/Observable';

import { feeConfig, FeeConfigStore } from './fee-config.store';
import { FeeConfigState } from '../interfaces/commerce.interface';
import { addStandardReducerTestsFor } from '../tests/reducer';

export function main() {
  const initialState: FeeConfigState = {
    initialized: false,
    feeConfig: { items: [] }
  };

  describe('feeConfig reducer', () => {
    describe('FEE_CONFIG.REPLACE', () => {
      addStandardReducerTestsFor(feeConfig, 'FEE_CONFIG.REPLACE', initialState);

      it('returns initialized = true + payload when current state is passed in', () => {
        expect(feeConfig(initialState, { type: 'FEE_CONFIG.REPLACE', payload: { property1: 'new', other: 'stuff' } }))
          .toEqual({ initialized: true, feeConfig: { property1: 'new', other: 'stuff' } });
      });

      it('returns initialized = true + payload when current state is not passed in', () => {
        expect(feeConfig(undefined, { type: 'FEE_CONFIG.REPLACE', payload: { some: 'payload' } }))
          .toEqual({ initialized: true, feeConfig: { some: 'payload' } });
      });

      it('returns initial state when payload is not passed in', () => {
        expect(feeConfig({ property1: 'existing1', property2: 'existing2' } as any, { type: 'FEE_CONFIG.REPLACE' }))
          .toEqual(initialState);
      });
    });

    describe('unrecognized type', () => {
      it('returns the existing state', () => {
        expect(feeConfig({ property1: 'existing1', property2: 'existing2' } as any, { type: 'blah' }))
          .toEqual({ property1: 'existing1', property2: 'existing2' });
      });
    });
  });

  describe('Fee Config Store', () => {
    let storeUnderTest: FeeConfigStore;
    let mockStore: any;

    beforeEach(() => {
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of({ someKey: 'someValue' })),
        dispatch: jasmine.createSpy('dispatch')
      };

      storeUnderTest = new FeeConfigStore(mockStore);
    });

    describe('data getter', () => {
      it('accesses the right part of the global store', () => {
        storeUnderTest.data.subscribe();
        expect(mockStore.select).toHaveBeenCalledWith('feeConfig');
      });

      it('returns the expected data', () => {
        storeUnderTest.data.subscribe(data => {
          expect(data).toEqual({ someKey: 'someValue' });
        });
      });
    });

    describe('state getter', () => {
      it('returns the state', () => {
        expect(storeUnderTest.state).toEqual({ someKey: 'someValue' });
      });
    });

    describe('initialized getter', () => {
      it('returns true when the store is initialized', () => {
        mockStore.select = () => Observable.of({ initialized: true });

        expect(storeUnderTest.initialized).toBe(true);
      });

      it('returns false when the store is not initialized', () => {
        mockStore.select = () => Observable.of({ initialized: false });

        expect(storeUnderTest.initialized).toBe(false);
      });

      it('returns false when the store\'s initialization state is somehow unknown', () => {
        mockStore.select = () => Observable.of({});

        expect(storeUnderTest.initialized).toBe(false);
      });
    });

    describe('feeConfig getter', () => {
      it('returns the feeConfig from the store', () => {
        mockStore.select = () => Observable.of({ initialized: true, feeConfig: { some: 'config' } });

        expect(storeUnderTest.feeConfig).toEqual({ some: 'config' });
      });

      it('returns the feeConfig even when the store isn\'t initialized', () => {
        mockStore.select = () => Observable.of({ initialized: false, feeConfig: { probable: 'garbage' } });

        expect(storeUnderTest.feeConfig).toEqual({ probable: 'garbage' });
      });

      it('returns undefined when the store doesn\'t have feeConfig data', () => {
        mockStore.select = () => Observable.of({});

        expect(storeUnderTest.feeConfig).toBeUndefined();
      });
    });

    describe('replaceFeeConfigWith', () => {
      it('dispatches FEE_CONFIG.REPLACE with the expected payload', () => {
        storeUnderTest.replaceFeeConfigWith({ some: 'new config' } as any);

        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'FEE_CONFIG.REPLACE', payload: { some: 'new config' } });
      });
    });
  });
}
