import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';

import {AssetList} from './asset-list.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';

export function main() {
  describe('Asset List Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: AssetList }),
      provide(Router, { useClass: RootRouter }),
    ]);

    it('Create instance of AssetList',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(AssetList).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetList).toBeTruthy();
        });
      }));
  });
}
