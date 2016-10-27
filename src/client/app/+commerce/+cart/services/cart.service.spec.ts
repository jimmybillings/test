import { Observable } from 'rxjs/Rx';

import { MockApiService, mockApiMatchers } from '../../../shared/mocks/mock-api.service';
import { Api } from '../../../shared/interfaces/api.interface';
import { CartService } from './cart.service';
import { Project, LineItem } from '../cart.interface';

export function main() {
  describe('Cart Service', () => {
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
    let mockApi: MockApiService;
    let mockCartSummaryService: any;
    let mockCurrentUserService: any;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);

      mockCartStore = {
        replaceWith: jasmine.createSpy('replaceWith'),
        data: Observable.of({ some: 'data' }),
        state: { some: 'state' }
      };

      mockApi = new MockApiService();

      mockCartSummaryService = {
        loadCartSummary: jasmine.createSpy('loadCartSummary')
      };

      mockCurrentUserService = {
        fullName: jasmine.createSpy('fullName').and.returnValue(Observable.of('Ross Edfort'))
      };

      serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCartSummaryService, mockCurrentUserService);
    });

    describe('data getter', () => {
      it('returns the data from the cart store', () => {
        serviceUnderTest.data.subscribe(data => {
          expect(data).toEqual({ some: 'data' });
        });
      });
    });

    describe('state getter', () => {
      it('returns the state from the cart store', () => {
        expect(serviceUnderTest.state).toEqual({ some: 'state' });
      });
    });

    describe('initializeData()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.initializeData();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('cart');
        expect(mockApi.get).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.getResponse);
        });
      });

      it('returns an empty observable and suppresses the actual response', () => {
        serviceUnderTest.initializeData().subscribe((data) => {
          expect(data).toEqual({});
        });
      });

      it('creates a default project if one does not already exist', () => {
        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('cart/project');
          expect(mockApi.post).toHaveBeenCalledWithBody({ name: 'Project A', clientName: 'Ross Edfort' });
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
        });
      });

      it('does not add a project if one already exists', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCartSummaryService, mockCurrentUserService);

        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApi.post).not.toHaveBeenCalled();
        });
      });
    });

    describe('addProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.addProject();

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('cart/project');
        expect(mockApi.post).toHaveBeenCalledWithBody({ name: 'Project A', clientName: 'Ross Edfort' });
        expect(mockApi.post).toHaveBeenCalledWithLoading(true);
      });

      it('names new projects based on existing names', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCartSummaryService, mockCurrentUserService);

        serviceUnderTest.addProject();

        expect(mockApi.post).toHaveBeenCalledWithBody({ name: 'Project B', clientName: 'Ross Edfort' });
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.addProject();

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.postResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.addProject();

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });

    describe('removeProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.delete).toHaveBeenCalledWithEndpoint('cart/project/123');
        expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.deleteResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });

      it('creates a new default project if the last one was deleted', () => {
        serviceUnderTest.removeProject(mockProject);

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('cart/project');
        expect(mockApi.post).toHaveBeenCalledWithBody({ name: 'Project A', clientName: 'Ross Edfort' });
        expect(mockApi.post).toHaveBeenCalledWithLoading(true);
      });

      it('does not add a project if one still exists after a removal', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCartSummaryService, mockCurrentUserService);

        serviceUnderTest.removeProject(mockProject);

        expect(mockApi.post).not.toHaveBeenCalled();
      });
    });

    describe('updateProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.updateProject(mockProject);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('cart/project');
        expect(mockApi.put).toHaveBeenCalledWithBody(mockProject);
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.updateProject(mockProject);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.putResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.updateProject(mockProject);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });

    describe('moveLineItemTo()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.moveLineItemTo(mockProject, mockLineItem);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('cart/move/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithParameters({ lineItemId: '456', projectId: '123' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.moveLineItemTo(mockProject, mockLineItem);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.putResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.moveLineItemTo(mockProject, mockLineItem);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });

    describe('cloneLineItem()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.cloneLineItem(mockLineItem);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('cart/clone/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithParameters({ lineItemId: '456' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.cloneLineItem(mockLineItem);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.putResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.cloneLineItem(mockLineItem);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });

    describe('removeLineItem()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.removeLineItem(mockLineItem);

        expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.delete).toHaveBeenCalledWithEndpoint('cart/asset/456');
        expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.removeLineItem(mockLineItem);

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.deleteResponse);
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.removeLineItem(mockLineItem);

        expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled();
      });
    });

    describe('purchaseOnCredit()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.purchaseOnCredit();

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('cart/checkout/purchaseOnCredit');
        expect(mockApi.post).toHaveBeenCalledWithLoading(true);
      });

      it('returns an observable of the back-end response', () => {
        serviceUnderTest.purchaseOnCredit()
          .subscribe(response => expect(response).toEqual(mockApi.postResponse));
      });

      it('does NOT replace the cart store with the response', () => {
        serviceUnderTest.purchaseOnCredit()
          .subscribe(_ => expect(mockCartStore.replaceWith).not.toHaveBeenCalled());
      });

      it('updates the cart summary service', () => {
        serviceUnderTest.purchaseOnCredit()
          .subscribe(_ => expect(mockCartSummaryService.loadCartSummary).toHaveBeenCalled());
      });
    });
  });
}
