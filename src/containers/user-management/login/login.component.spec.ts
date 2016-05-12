import {provide} from 'angular2/core';
import {describe, expect, it, inject, TestComponentBuilder, beforeEachProviders} from 'angular2/testing';
import {Observable} from 'rxjs/Rx';
import { ApiConfig } from '../../../common/config/api.config';
import {CurrentUser} from '../../../common/models/current-user.model';
import {Authentication} from '../services/authentication.data.service';
import { User } from '../services/user.data.service';
import {FormModel} from '../../../components/wz-form/wz.form.model';

import {Login} from './login.component';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, Location, RouteConfig} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {UiConfig, config} from '../../../common/config/ui.config';
import { provideStore } from '@ngrx/store';

export function main() {

  const res = { 'user': { 'test': 'one' }, token: {token: 'newToken'}};

  describe('Login Component', () => {
    class Home {}
    class MockAuthentication {
      create() {
        return Observable.of(res);
      }
    }

    beforeEachProviders(() => [
      Login,
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Login }),
      ApiConfig,
      CurrentUser,
      UiConfig,
      User,
      FormModel,
      HTTP_PROVIDERS,
      RouteConfig,
      RouteRegistry,
      provide(Router, { useClass: RootRouter }),
      provide(Authentication, { useClass: MockAuthentication }),
      provide(Location, { useClass: SpyLocation }),
      provideStore({config: config}),
    ]);

    it('Should have a Login instance',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(Login).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Login).toBeTruthy();
        });
      })
    );

    it('Should set token in localStorage, set the new user, navigate to home page on succesful login',
      inject([Login], (login) => {
        login.router.config([ { path: '/', name: 'Home', component: Home }]);
        localStorage.clear();
        spyOn(localStorage, 'setItem');
        spyOn(login._currentUser, 'set');
        spyOn(login.router, 'navigate');
        login.onSubmit({ userId: 'some@email.com', password: 'password', siteName: 'sample' });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'newToken');
        expect(login._currentUser.set).toHaveBeenCalledWith({ 'test': 'one' });
        expect(login.router.navigate).toHaveBeenCalledWith(['/Home']);
    }));

  });

}
