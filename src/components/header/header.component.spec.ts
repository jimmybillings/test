import {
TestComponentBuilder,
describe,
expect,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {Header} from './header.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {UiConfig} from '../../common/config/ui.config';
import {ViewportHelper} from 'ng2-material/all';

export function main() {
  describe('Header Component', () => {
    beforeEachProviders(() => [
      Header,
      RouteRegistry,
      ViewportHelper,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Header }),
      provide(Router, { useClass: RootRouter }),
      UiConfig,
      ViewportHelper
    ]);

    it('Should have a header instance',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(Header).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Header).toBeTruthy();
        });
      }));
    
    it('Should fire an event to logout a user', inject([Header], (component) => {
      spyOn(component.onLogOut, 'emit');
      component.logOut(event);
      expect(component.onLogOut.emit).toHaveBeenCalledWith(event);
    }));
  });
}
