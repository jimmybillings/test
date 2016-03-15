import {
TestComponentBuilder,
describe,
expect,
injectAsync,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {Logout} from './logout.component';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import {CurrentUser} from '../../../common/models/current-user.model';
import {Authentication} from '../authentication.data.service';
import {Observable} from 'rxjs/Rx';
import {HTTP_PROVIDERS} from 'angular2/http';

export function main() {
  describe('Logout Component', () => {
    
    class Home {} 
    
    const res = {'test': 'test'};
    
    class MockAuthentication {
      destroy() {
        return Observable.of(res);
      }
    }
    
    beforeEachProviders(() => [
      Logout,
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Logout }),
      provide(Router, { useClass: RootRouter }),
      MockBackend,
      HTTP_PROVIDERS,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(Authentication, { useClass: MockAuthentication }),
      ApiConfig,
      CurrentUser,
    ]);

    it('Should have a logout instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Logout).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Logout).toBeTruthy();
          expect(instance._currentUser instanceof CurrentUser).toBeDefined();
          expect(instance._authentication instanceof Authentication).toBeDefined();
        });
      }));
    
    it('Should log out a user, clear localStorage, reset currentUser', inject([Logout], (logout) => {
      logout.router.config([ { path: '/', name: 'Home', component: Home }]);
      spyOn(localStorage, 'clear');
      spyOn(logout._currentUser, 'set');
      spyOn(logout.router, 'navigate');
      logout.onSubmit();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(logout._currentUser.set).toHaveBeenCalled();
      expect(logout.router.navigate).toHaveBeenCalledWith(['/Home']);
    }));

  });
}
