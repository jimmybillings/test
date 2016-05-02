import {
TestComponentBuilder,
describe,
expect,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {BinTray} from './bin-tray.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, RouteConfig} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {UiConfig} from '../../common/config/ui.config';
import {ViewportHelper} from 'ng2-material/all';

export function main() {
  describe('Bin Tray Component', () => {
    class Search {}
    beforeEachProviders(() => [
      BinTray,
      RouteConfig,
      RouteRegistry,
      RouteRegistry,
      ViewportHelper,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: BinTray }),
      provide(Router, { useClass: RootRouter }),
      UiConfig
    ]);

    it('Should have a bin tray instance',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(BinTray).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof BinTray).toBeTruthy();
        });
      }));
    
    // it('Should create the form object for the search bar', inject([SearchBox], (component) => {
    //   component.setForm();
    //   expect(component.searchForm.value).toEqual({ query: '' });
    // }));
    
    // it('Should fire an event to logout a user', inject([SearchBox], (component) => {
    //   component.config = {};
    //   component.config.pageSize = {};
    //   component.config.pageSize.value = 25;
    //   component.router.config([ { path: '/Search', name: 'Search', component: Search }]);
    //   spyOn(component.router, 'navigate');
    //   component.onSubmit('Dogs');
    //   expect(component.router.navigate).toHaveBeenCalledWith(['/Search', { q: 'Dogs', n: 25 }]);
    // }));
    
  });
}
