import { Observable } from 'rxjs/Observable';

import { AssetEffects } from './asset.effects';
import * as AssetActions from '../actions/asset.actions';

export function main() {
  describe('Asset Effects', () => {
    let effectsUnderTest: AssetEffects;
    let mockActions: any;
    let mockAssetService: any;

    beforeEach(() => {
      mockActions = {
        ofType: jasmine.createSpy('ofType').and.callFake((type: string) => {
          switch (type) {
            case AssetActions.LOAD: return Observable.of({ payload: { some: 'parameters' } });
            default: return null;
          }
        })
      };
      mockAssetService = { load: jasmine.createSpy('load').and.returnValue(Observable.of({ some: 'asset' })) };
      effectsUnderTest = new AssetEffects(mockActions, mockAssetService);
    });

    describe('load effect', () => {
      it('calls the load service method correctly', () => {
        effectsUnderTest.load.subscribe(() => {
          expect(mockAssetService.load).toHaveBeenCalledWith({ some: 'parameters' });
        });
      });

      it('triggers the correct action', () => {
        effectsUnderTest.load.subscribe(action => {
          expect(action.type).toBe(AssetActions.LOAD_SUCCESS);
        });
      });

      it('sends the correct payload with the triggered action', () => {
        effectsUnderTest.load.subscribe(action => {
          expect(action.payload).toEqual({ some: 'asset' });
        });
      });
    });
  });
}
