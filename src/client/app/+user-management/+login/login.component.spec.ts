import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { Router } from '@angular/router';
import {provide, Renderer, PLATFORM_PIPES} from '@angular/core';
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
import { TranslatePipe } from 'ng2-translate/ng2-translate';

export function main() {

  const res = { 'user': { 'test': 'one' }, token: { token: 'newToken' } };

  describe('Login Component', () => {
    class Home { }
    class MockAuthentication {
      create() {
        return Observable.of(res);
      }
    }
    class MockRouter {
      navigate() {
        return true;
      }
    }

    beforeEachProviders(() => [
      LoginComponent,
      Renderer,
      ApiConfig,
      CurrentUser,
      UiConfig,
      UiState,
      User,
      FormModel,
      HTTP_PROVIDERS,
      { provide: Router, useClass: MockRouter },
      provide(Authentication, { useClass: MockAuthentication }),
      provideStore({ config: config, uiState: uiState }),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true})
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
