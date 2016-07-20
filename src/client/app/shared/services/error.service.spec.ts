import {
  beforeEachProvidersArray,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { Error } from './error.service';

export function main() {
  describe('Error Service', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should rediect to the login page on a 401 response', inject([Error], (service: Error) => {
      let error = { status: 401 };
      spyOn(service.router, 'navigate');
      service.handle(error);
      expect(service.router.navigate).toHaveBeenCalledWith(['/user/login']);
    }));
  });
}
