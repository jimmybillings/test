import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';

import {Footer} from './footer.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';

export function main() {
  describe('Footer Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Footer }),
      provide(Router, { useClass: RootRouter })
    ]);

    it('Should have a footer instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Footer).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Footer).toBeTruthy();
        });
      }));

  });
}
