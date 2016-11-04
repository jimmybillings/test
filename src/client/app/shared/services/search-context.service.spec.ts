import {
  beforeEachProvidersArray,
  inject,
  TestBed
} from '../../imports/test.imports';

import { SearchContext } from './search-context.service';

export function main() {
  describe('Search Context', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        SearchContext
      ]
    }));

    it('Should initialize with router, context, and store',
      inject([SearchContext], (service: SearchContext) => {
        expect(service.router).toBeDefined();
        expect(service.store).toBeDefined();
        expect(service.data).toBeDefined();
      }));

    it('Should initialize the store with a default state',
      inject([SearchContext], (service: SearchContext) => {
        service.data.subscribe(data => {
          expect(data).toEqual({ q: null, i: 1, n: 100, sortId: 12 });
        });
      }));

    it('Should have a new() method that updates the store and calls go()',
      inject([SearchContext], (service: SearchContext) => {
        spyOn(service, 'go');
        service.new({ q: 'cat', i: 1, n: 100 });
        service.data.subscribe(data => {
          expect(data).toEqual({ q: 'cat', i: '1', n: '100' });
        });
        expect(service.go).toHaveBeenCalled();
      }));

    it('Should have a state getter method that returns the searchContext',
      inject([SearchContext], (service: SearchContext) => {
        expect(service.state).toEqual({ q: null, i: 1, n: 100, sortId: 12 });
        service.update = { q: 'cat', i: 1, n: 100 };
        expect(service.state).toEqual({ q: 'cat', i: '1', n: '100', sortId: 12 });
      }));

    it('Should have an update setter method that updates the store with params',
      inject([SearchContext], (service: SearchContext) => {
        service.update = { q: 'cat', i: 1, n: 100 };
        service.data.subscribe(data => {
          expect(data).toEqual({ q: 'cat', i: '1', n: '100', sortId: 12 });
        });
      }));

    it('Should have an update setter method that updates the store with decoded params',
      inject([SearchContext], (service: SearchContext) => {
        service.update = { q: 'cats%20and%20dogs', i: 1, n: 100 };
        service.data.subscribe(data => {
          expect(data).toEqual({ q: 'cats and dogs', i: '1', n: '100', sortId: 12 });
        });
      }));
  });
}
