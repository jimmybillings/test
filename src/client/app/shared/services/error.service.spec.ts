import {
  beforeEachProvidersArray,
  TestBed,
  inject
} from '../../imports/test.imports';

import { ErrorActions } from './error.service';

export function main() {
  describe('Error Service', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));

    it('Should rediect to the login page on a 401 response', inject([ErrorActions], (service: ErrorActions) => {
      let error = { status: 401 };
      spyOn(service, 'unAuthorized');
      service.handle(error);
      expect(service.unAuthorized).toHaveBeenCalled();
    }));
  });
}
