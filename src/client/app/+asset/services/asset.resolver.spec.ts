import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AssetResolver } from './asset.resolver';
import { StoreSpecHelper } from '../../store/store.spec-helper';

export function main() {
  describe('Asset Resolver', () => {
    let resolverUnderTest: AssetResolver;
    let storeSpecHelper: StoreSpecHelper;

    const relevantParameters = {
      id: 'some id', share_key: 'some share_key', uuid: 'some uuid', timeEnd: 'some timeEnd', timeStart: 'some timeStart'
    };
    const mockRoute = { params: { ...relevantParameters, other: 'useless stuff' } };

    beforeEach(() => {
      storeSpecHelper = new StoreSpecHelper();
      resolverUnderTest = new AssetResolver(storeSpecHelper.mockStore);
    });

    describe('resolve()', () => {
      it('dispatches the expected action', () => {
        const spy = storeSpecHelper.createMockActionFactoryMethod(factory => factory.asset, 'load');

        resolverUnderTest.resolve(mockRoute as any);

        storeSpecHelper.expectDispatchFor(spy, relevantParameters);
      });

      describe('returns an Observable that', () => {
        beforeEach(() => {
          storeSpecHelper.createMockActionFactoryMethod(factory => factory.asset, 'load');
        });

        it('does not emit when the asset has not been loaded yet', () => {
          storeSpecHelper.createMockStateElement('asset', 'loaded', false);

          expect(() => {
            resolverUnderTest.resolve(mockRoute as any).subscribe(() => {
              throw new Error('Should not get here!');
            });
          }).not.toThrow();
        });

        it('emits when the asset has been loaded', () => {
          storeSpecHelper.createMockStateElement('asset', 'loaded', true);

          expect(() => {
            resolverUnderTest.resolve(mockRoute as any).subscribe(() => {
              throw new Error('Should get here!');
            });
          }).toThrow();
        });
      });
    });
  });
};
