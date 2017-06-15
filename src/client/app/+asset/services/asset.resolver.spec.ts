import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AssetResolver } from './asset.resolver';
import * as AssetActions from '../../shared/actions/asset.actions';

export function main() {
  describe('Asset Resolver', () => {
    let resolverUnderTest: AssetResolver;
    let mockState: any;
    let mockStore: any;

    const relevantParameters = {
      id: 'some id', share_key: 'some share_key', uuid: 'some uuid', timeEnd: 'some timeEnd', timeStart: 'some timeStart'
    };
    const mockRoute = { params: { ...relevantParameters, other: 'useless stuff' } };

    beforeEach(() => {
      mockState = { asset: { loaded: false } };

      mockStore = {
        dispatch: jasmine.createSpy('dispatch'),
        select: jasmine.createSpy('select').and.callFake((selector: Function) => Observable.of(selector(mockState)))
      };

      resolverUnderTest = new AssetResolver(mockStore);
    });

    describe('resolve()', () => {
      it('dispatches the expected action with the expected payload', () => {
        resolverUnderTest.resolve(mockRoute as any);

        expect(mockStore.dispatch).toHaveBeenCalledWith(new AssetActions.Load(relevantParameters));
      });

      describe('returns an Observable that', () => {
        it('does not emit when the asset has not been loaded yet', () => {
          expect(() => {
            resolverUnderTest.resolve(mockRoute as any).subscribe(() => {
              throw new Error();
            });
          }).not.toThrow();
        });

        it('emits when the asset has been loaded', () => {
          mockState.asset.loaded = true;

          resolverUnderTest.resolve(mockRoute as any).subscribe(output => {
            expect(output).toEqual(true);
          });
        });
      });
    });
  });
};
