import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  addProviders,
  Observable,
  inject,
} from '../../imports/test.imports';

import { LoginComponent } from './login.component';
import { Authentication } from '../services/authentication.data.service';

export function main() {
  const res = { 'user': { 'test': 'one' }, token: { token: 'newToken' } };
  describe('Login Component', () => {
    class MockAuthentication {
      create() {
        return Observable.of(res);
      }
    }

    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        { provide: Authentication, useClass: MockAuthentication },
        LoginComponent,
      ]);
    });

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
