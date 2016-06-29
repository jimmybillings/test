import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

// import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import {provide, Renderer} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { ApiConfig } from '../../shared/services/api.config';
import {CurrentUser} from '../../shared/services/current-user.model';
import {Authentication} from '../services/authentication.data.service';
import { User } from '../services/user.data.service';
import {FormModel} from '../../shared/components/wz-form/wz.form.model';
import {LoginComponent} from './login.component';
import {HTTP_PROVIDERS} from '@angular/http';
import {UiConfig, config} from '../../shared/services/ui.config';
import { provideStore } from '@ngrx/store';
import { UiState, uiState} from '../../shared/services/ui.state';
import { ToastService } from '../../shared/components/toast/toast.service';

export function main() {

  const res = { 'user': { 'test': 'one' }, token: { token: 'newToken' } };

  describe('Login Component', () => {
    class Home { }
    class MockAuthentication {
      create() {
        return Observable.of(res);
      }
    }

    beforeEachProviders(() => [
      LoginComponent,
      ToastService,
      Renderer,
      ApiConfig,
      CurrentUser,
      UiConfig,
      UiState,
      User,
      FormModel,
      HTTP_PROVIDERS,
      // ROUTER_FAKE_PROVIDERS,
      provide(Authentication, { useClass: MockAuthentication }),
      provideStore({ config: config, uiState: uiState }),

    ]);

    it('Should have a Login instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(LoginComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof LoginComponent).toBeTruthy();
        });
      })
    );

    it('Should set token in localStorage, set the new user, navigate to home page on succesful login',
      inject([LoginComponent], (login: LoginComponent) => {
        login.router.createUrlTree([{ path: '/', component: Home }]);
        localStorage.clear();
        spyOn(localStorage, 'setItem');
        spyOn(login._currentUser, 'set');
        spyOn(login.router, 'navigate');
        login.onSubmit({ userId: 'some@email.com', password: 'password', siteName: 'sample' });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'newToken');
        expect(login._currentUser.set).toHaveBeenCalledWith({ 'test': 'one' });
        expect(login.router.navigate).toHaveBeenCalledWith(['/']);
      }));

  });

}
