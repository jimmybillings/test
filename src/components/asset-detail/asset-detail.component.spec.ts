import {
TestComponentBuilder,
describe,
expect,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {AssetDetail} from './asset-detail.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';

export function main() {
  describe('Asset Detail Component', () => {
    beforeEachProviders(() => [
      AssetDetail,
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: AssetDetail }),
      provide(Router, { useClass: RootRouter }),
    ]);

    it('Create instance of AssetDetail',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(AssetDetail).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetDetail).toBeTruthy();
        });
      }));   
  });
}
