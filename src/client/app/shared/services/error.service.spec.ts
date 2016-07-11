import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { Error } from './error.service';
import { CurrentUser, currentUser} from '../services/current-user.model';
import {Router} from '@angular/router';

export function main() {
  describe('Error Service', () => {
    class MockRouter {
      navigate(params: any) {
        return params;
      }
    }
    beforeEachProviders(() => [
      Error,
      { provide: Router, useClass: MockRouter },
      CurrentUser,
      provideStore({ currentUser }),
    ]);

    it('Should rediect to the login page on a 401 response', inject([Error], (service: Error) => {
      let error = { status: 401 };
      spyOn(service.router, 'navigate');
      service.handle(error);
      expect(service.router.navigate).toHaveBeenCalledWith(['user/login']);
    }));

  });


}
