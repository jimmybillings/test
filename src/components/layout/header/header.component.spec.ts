import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';

import {Header} from './header.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {UiConfig} from '../../../common/config/ui.config';

export function main() {
  describe('Header Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Header }),
      provide(Router, { useClass: RootRouter }),
      UiConfig
    ]);

    it('Should have a header instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Header).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Header).toBeTruthy();
        });
      }));

    it('Should initialize the header position to be abosulte positioned by setting \'showFixed\' to be false',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Header).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance.showFixed).toEqual(false);
        });
      }));

    it('Should set the header to absolute by setting \'showFixed\' to be false if the page scrolls less than 68px\'s',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Header).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          instance.showFixedHeader(70);
          expect(instance.showFixed).toEqual(true);
        });
      }));

    it('Should set the header to fixed by setting \'showFixed\' to be true if the page scrolls down more than 68px\'s',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Header).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          instance.showFixedHeader(66);
          expect(instance.showFixed).toEqual(false);
        });
      }));
  });
}
