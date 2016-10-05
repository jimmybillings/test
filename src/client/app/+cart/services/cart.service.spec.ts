import { Response, ResponseOptions } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { CartService } from './cart.service';
import { Project, LineItem } from '../cart.interface';

export function main() {
  describe('Cart Service', () => {
    const apiResponseWith = (object: Object) => {
      return Observable.of(new Response(new ResponseOptions({ body: JSON.stringify(object) })));
    };

    const mockGetResponse: Object = { 'text': 'MOCK GET RESPONSE' };
    const mockPostResponse: Object = { 'text': 'MOCK POST RESPONSE' };
    const mockDeleteResponse: Object = { 'text': 'MOCK DELETE RESPONSE' };
    const mockUpdateResponse: Object = { 'text': 'MOCK UPDATE RESPONSE' };

    const mockProject: Project = {
      id: '123',
      name: 'Fred',
      clientName: 'Barney',
      subtotal: 0
    };

    const mockLineItem: LineItem = {
      id: '456',
      price: 0
    };

    let serviceUnderTest: CartService;
    let mockCartStore: any;
    let mockApiService: any;
    let mockCartSummaryService: any;

    beforeEach(() => {
      mockCartStore = {
        replaceWith: jasmine.createSpy('replaceWith'),
        state: {}
      };

      mockApiService = {
        get: jasmine.createSpy('get').and.returnValue(apiResponseWith(mockGetResponse)),
        post: jasmine.createSpy('post').and.returnValue(apiResponseWith(mockPostResponse)),
        delete: jasmine.createSpy('delete').and.returnValue(apiResponseWith(mockDeleteResponse)),
        put: jasmine.createSpy('put').and.returnValue(apiResponseWith(mockUpdateResponse))
      };

      mockCartSummaryService = {
        loadCartSummary: jasmine.createSpy('loadCartSummary')
      };

      serviceUnderTest = new CartService(mockCartStore, mockApiService, mockCartSummaryService);
    });

    describe('initializeData()', () => {
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

      it('does not add a project if one already exists', () => {
        mockCartStore.state = { projects: [{ name: 'Project A' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApiService, mockCartSummaryService);

        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApiService.post).not.toHaveBeenCalled();
        });
      });
    });

    describe('addProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.addProject();

        expect(mockApiService.post).toHaveBeenCalledWith('/api/orders/v1/cart/project', JSON.stringify({ name: 'Project A' }), {}, true);
      });

      it('names new projects based on existing names', () => {
        mockCartStore.state = { projects: [{ name: 'Project A' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApiService, mockCartSummaryService);

        serviceUnderTest.addProject();

        expect(mockApiService.post).toHaveBeenCalledWith('/api/orders/v1/cart/project', JSON.stringify({ name: 'Project B' }), {}, true);
      });

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

      it('creates a new default project if the last one was deleted', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockApiService.post).toHaveBeenCalledWith('/api/orders/v1/cart/project', JSON.stringify({ name: 'Project A' }), {}, true);
      });

      it('does not add a project if one still exists after a removal', () => {
        mockCartStore.state = { projects: [{ name: 'Project A' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApiService, mockCartSummaryService);

        serviceUnderTest.removeProject(mockProject);

        expect(mockApiService.post).not.toHaveBeenCalled();
      });
    });

    describe('updateProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.updateProject(mockProject);

        expect(mockApiService.put).toHaveBeenCalledWith('/api/orders/v1/cart/project', JSON.stringify(mockProject), {}, true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.updateProject(mockProject);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockUpdateResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.updateProject(mockProject);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });

    describe('moveLineItemTo()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.moveLineItemTo(mockProject, mockLineItem);

        expect(mockApiService.put)
          .toHaveBeenCalledWith('/api/orders/v1/cart/move/lineItem?lineItemId=456&projectId=123', '', {}, true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.moveLineItemTo(mockProject, mockLineItem);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockUpdateResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.moveLineItemTo(mockProject, mockLineItem);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });
  });
}
