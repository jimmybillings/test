import {
  beforeEachProvidersArray,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { FilterService } from './filter.service';

export function main() {
  describe('Filter Service', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      FilterService
    ]);

    it('Should exist',
      inject([FilterService], (service: FilterService) => {
        expect(service).toBeDefined();
      }));
  });
}
