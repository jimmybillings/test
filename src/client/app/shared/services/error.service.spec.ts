import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { Error } from './error.service';
import { CurrentUser, currentUser} from '../services/current-user.model';

export function main() {
  describe('Error Service', () => {

    beforeEachProviders(() => [
      Error,
      ROUTER_FAKE_PROVIDERS,
      CurrentUser,
      provideStore({ currentUser }),
    ]);

    it('Should rediect to the login page on a 401 response', inject([Error], (service: Error) => {
      let error = { status: 401 };
      spyOn(service._currentUser, 'destroy');
      spyOn(service.router, 'navigate');
      service.handle(error);
      expect(service._currentUser.destroy).toHaveBeenCalled();
      expect(service.router.navigate).toHaveBeenCalledWith(['UserManagement/Login']);
    }));

  });


}
