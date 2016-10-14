import {
  beforeEachProvidersArray,
  TestBed,
  Observable,
  inject,
} from '../../imports/test.imports';

import { LoginComponent } from './login.component';
import { Authentication } from '../../shared/services/authentication.data.service';

export function main() {
  const res = { 'user': { 'test': 'one' }, token: { token: 'newToken' }, userPreferences: {pref1: 'pref1'} };
  describe('Login Component', () => {
    class MockAuthentication {
      create() {
        return Observable.of(res);
      }
    }

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        { provide: Authentication, useClass: MockAuthentication },
        LoginComponent,
      ]
    }));

    it('Should set token in localStorage, set the new user, navigate to home page on succesful login',
      inject([LoginComponent], (login: LoginComponent) => {
        localStorage.clear();
        spyOn(localStorage, 'setItem');
        spyOn(login._currentUser, 'set');
        spyOn(login.router, 'navigate');
        spyOn(login.userPreference, 'set');
        login.onSubmit({ userId: 'some@email.com', password: 'password', siteName: 'sample' });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'newToken');
        expect(login._currentUser.set).toHaveBeenCalledWith({ 'test': 'one' });
        expect(login.router.navigate).toHaveBeenCalledWith(['/']);
        expect(login.userPreference.set).toHaveBeenCalledWith({pref1: 'pref1'});
      }));
  });
}
