import { Observable } from 'rxjs/Rx';

import { Api } from '../../../shared/interfaces/api.interface';
import { CartService } from './cart.service';
import { Project, LineItem } from '../cart.interface';

export function main() {
  describe('Cart Service', () => {
    const apiResponseWith = (object: Object) => {
      return Observable.of(object);
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
    let mockApi: any;
    let mockCartSummaryService: any;
    let mockCurrentUserService: any;

    beforeEach(() => {
      mockCartStore = {
        replaceWith: jasmine.createSpy('replaceWith'),
        state: {}
      };

      mockApi = {
        get: jasmine.createSpy('get').and.returnValue(apiResponseWith(mockGetResponse)),
        post: jasmine.createSpy('post').and.returnValue(apiResponseWith(mockPostResponse)),
        delete: jasmine.createSpy('delete').and.returnValue(apiResponseWith(mockDeleteResponse)),
        put: jasmine.createSpy('put').and.returnValue(apiResponseWith(mockUpdateResponse))
      };

      mockCartSummaryService = {
        loadCartSummary: jasmine.createSpy('loadCartSummary')
      };

      mockCurrentUserService = {
        fullName: jasmine.createSpy('fullName').and.returnValue(Observable.of('Ross Edfort'))
      };

      serviceUnderTest = new CartService(mockCartStore, mockApi, mockCartSummaryService, mockCurrentUserService);
    });

    describe('initializeData()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.initializeData();

        expect(mockApi.get)
          .toHaveBeenCalledWith(Api.Orders, 'cart', { loading: true });
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
          expect(mockApi.post).toHaveBeenCalledWith(Api.Orders, 'cart/project', { body: { name: 'Project A', clientName: 'Ross Edfort' }, loading: true });
        });
      });

      it('does not add a project if one already exists', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi, mockCartSummaryService, mockCurrentUserService);

        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApi.post).not.toHaveBeenCalled();
        });
      });
    });

    describe('addProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.addProject();

        expect(mockApi.post).toHaveBeenCalledWith(Api.Orders, 'cart/project', { body: { name: 'Project A', clientName: 'Ross Edfort' }, loading: true });
      });

      it('names new projects based on existing names', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi, mockCartSummaryService, mockCurrentUserService);

        serviceUnderTest.addProject();

        expect(mockApi.post).toHaveBeenCalledWith(Api.Orders, 'cart/project', { body: { name: 'Project B', clientName: 'Ross Edfort' }, loading: true });
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

        expect(mockApi.delete).toHaveBeenCalledWith(Api.Orders, 'cart/project/123', { loading: true });
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

        expect(mockApi.post).toHaveBeenCalledWith(Api.Orders, 'cart/project', { body: { name: 'Project A', clientName: 'Ross Edfort' }, loading: true });
      });

      it('does not add a project if one still exists after a removal', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi, mockCartSummaryService, mockCurrentUserService);

        serviceUnderTest.removeProject(mockProject);

        expect(mockApi.post).not.toHaveBeenCalled();
      });
    });

    describe('updateProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.updateProject(mockProject);

        expect(mockApi.put).toHaveBeenCalledWith(Api.Orders, 'cart/project', { body: mockProject, loading: true });
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

        expect(mockApi.put)
          .toHaveBeenCalledWith(Api.Orders, 'cart/move/lineItem', { parameters: { lineItemId: '456', projectId: '123' }, loading: true });
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
