import { inject, TestBed, beforeEachProvidersArray, Response, ResponseOptions } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../../shared/services/api.service';
import { CartSummaryService } from '../../shared/services/cart-summary.service';
import { CartService } from './cart.service';
import { CartStore } from './cart.store';
import { Project } from '../cart.interface';

export function main() {
  describe('Cart Service', () => {
    const apiResponseWith = (object: Object) => {
      return Observable.of(new Response(new ResponseOptions({ body: JSON.stringify(object) })));
    };

    const mockGetResponse: Object = { 'text': 'MOCK GET RESPONSE' };
    const mockPostResponse: Object = { 'text': 'MOCK POST RESPONSE' };
    const mockDeleteResponse: Object = { 'text': 'MOCK DELETE RESPONSE' };

    const mockProject: Project = {
      id: '123',
      name: 'Fred',
      subtotal: 0
    };

    let mockApiService: any;
    let mockCartSummaryService: any;
    let mockCartStore: any;

    beforeEach(() => {
      mockApiService = {
        get: jasmine.createSpy('get').and.returnValue(apiResponseWith(mockGetResponse)),
        post: jasmine.createSpy('post').and.returnValue(apiResponseWith(mockPostResponse)),
        delete: jasmine.createSpy('delete').and.returnValue(apiResponseWith(mockDeleteResponse))
      };

      mockCartSummaryService = {
        loadCartSummary: jasmine.createSpy('loadCartSummary')
      };

      mockCartStore = {
        replaceWith: jasmine.createSpy('replaceWith'),
        state: {}
      };

      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CartService,
          { provide: ApiService, useValue: mockApiService },
          { provide: CartSummaryService, useValue: mockCartSummaryService },
          { provide: CartStore, useValue: mockCartStore }
        ]
      });
    });

    describe('initializeData()', () => {
      let serviceUnderTest: CartService;

      beforeEach(inject([CartService], (cartService: CartService) => {
        serviceUnderTest = cartService;
      }));

      it('calls the API service correctly', () => {
        serviceUnderTest.initializeData();

        expect(mockApiService.get)
          .toHaveBeenCalledWith('/api/orders/v1/cart', {}, true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockGetResponse);
        });
      });

      it('returns an empty observable and suppresses the actual response', () => {
        serviceUnderTest.initializeData().subscribe((data) => {
          expect(data).toEqual({});
        });
      });

      it('creates a default project if one does not already exist', () => {
        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApiService.post).toHaveBeenCalledWith('/api/orders/v1/cart/project', JSON.stringify({ name: 'Project A' }), {}, true);
        });
      });

      it('does not add a project if one already exists', inject([CartStore], (cartStore: CartStore) => {
        (cartStore as any).state = { projects: [{ name: 'Project A' }] };

        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApiService.post).not.toHaveBeenCalled();
        });
      }));
    });

    describe('addProject()', () => {
      let serviceUnderTest: CartService;

      beforeEach(inject([CartService], (cartService: CartService) => {
        serviceUnderTest = cartService;
      }));

      it('calls the API service correctly', () => {
        serviceUnderTest.addProject();

        expect(mockApiService.post).toHaveBeenCalledWith('/api/orders/v1/cart/project', JSON.stringify({ name: 'Project A' }), {}, true);
      });

      it('names new projects based on existing names', inject([CartStore], (cartStore: CartStore) => {
        (cartStore as any).state = { projects: [{ name: 'Project A' }] };
        expect(serviceUnderTest.state.projects[0].name).toEqual('Project A');  // test that tests this test ;-)

        serviceUnderTest.addProject();

        expect(mockApiService.post).toHaveBeenCalledWith('/api/orders/v1/cart/project', JSON.stringify({ name: 'Project B' }), {}, true);
      }));

      it('replaces the cart store with the response', () => {
        serviceUnderTest.addProject();

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockPostResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.addProject();

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });

    describe('removeProject()', () => {
      let serviceUnderTest: CartService;

      beforeEach(inject([CartService], (cartService: CartService) => {
        serviceUnderTest = cartService;
      }));

      it('calls the API service correctly', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockApiService.delete).toHaveBeenCalledWith('/api/orders/v1/cart/project/123', {}, true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockDeleteResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });
  });
}
