import { Observable } from 'rxjs/Rx';

import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api, ApiBody, ApiParameters } from '../interfaces/api.interface';
import { CartService } from './cart.service';
import { Project, LineItem } from '../interfaces/cart.interface';

export function main() {
  describe('Cart Service', () => {
    const mockProject: Project = {
      id: '123',
      name: 'Fred',
      clientName: 'Barney',
      subtotal: 0
    };

    const mockProjectB: Project = {
      name: 'Project A',
      clientName: 'Ross Edfort',
      id: '111',
      subtotal: 0
    };

    const mockLineItem: LineItem = {
      id: '456',
      price: 0
    };

    let serviceUnderTest: CartService;
    let mockCartStore: any;
    let mockApi: MockApiService;
    let mockCurrentUserService: any;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);

      mockCartStore = {
        replaceWith: jasmine.createSpy('replaceWith'),
        data: Observable.of({ some: 'data' }),
        state: { some: 'state' }
      };

      mockApi = new MockApiService();

      mockCurrentUserService = {
        fullName: jasmine.createSpy('fullName').and.returnValue(Observable.of('Ross Edfort'))
      };

      serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCurrentUserService);
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
        mockCartStore.state = { projects: [] };
        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('cart/project');
          expect(mockApi.post).toHaveBeenCalledWithBody({ name: 'Project A', clientName: 'Ross Edfort' });
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
        });
      });

      it('does not add a project if one already exists', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCurrentUserService);

        serviceUnderTest.initializeData().subscribe(() => {
          expect(mockApi.post).not.toHaveBeenCalled();
        });
      });
    });

    describe('getCartSummary', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.getCartSummary();

        expect(mockApi.get).toHaveBeenCalledWith(Api.Orders, 'cart/summary');
      });

      it('places the response in the cart store', () => {
        mockApi.getResponse = { lineItem: { asset: { assetId: '10836' } } };

        serviceUnderTest.getCartSummary();

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith({ lineItem: { asset: { assetId: '10836' } } });
      });
    });

    describe('addAssetToProjectInCart()', () => {
      beforeEach(() => {
        mockCartStore.state = { projects: [mockProjectB] };
      });

      it('calls the api service correctly', () => {
        const body: ApiBody = { lineItem: { asset: { assetId: '10836' }, selectedTranscodeTarget: '1080p' } };
        const parameters: ApiParameters = { projectName: 'Project A', region: 'AAA' };

        serviceUnderTest.addAssetToProjectInCart('10836', '1080p');

        expect(mockApi.put)
          .toHaveBeenCalledWith(Api.Orders, 'cart/asset/lineItem/quick', { body: body, parameters: parameters });
      });

      it('calls the api service correctly - no transcode target', () => {
        const body: ApiBody = { lineItem: { asset: { assetId: '10836' }, selectedTranscodeTarget: 'master_copy' } };
        const parameters: ApiParameters = { projectName: 'Project A', region: 'AAA' };

        serviceUnderTest.addAssetToProjectInCart('10836');

        expect(mockApi.put)
          .toHaveBeenCalledWith(Api.Orders, 'cart/asset/lineItem/quick', { body: body, parameters: parameters });
      });

      it('adds the asset to the cart store', () => {
        mockApi.putResponse = { lineItem: { asset: { assetId: '10836' } } };

        serviceUnderTest.addAssetToProjectInCart('10836');

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith({ lineItem: { asset: { assetId: '10836' } } });
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
        serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCurrentUserService);

        serviceUnderTest.addProject();

        expect(mockApi.post).toHaveBeenCalledWithBody({ name: 'Project B', clientName: 'Ross Edfort' });
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.addProject();

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.postResponse);
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

      it('creates a new default project if the last one was deleted', () => {
        serviceUnderTest.removeProject(mockProject);
        serviceUnderTest.removeProject(mockProjectB);

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('cart/project');
        expect(mockApi.post).toHaveBeenCalledWithBody({ name: 'Project A', clientName: 'Ross Edfort' });
        expect(mockApi.post).toHaveBeenCalledWithLoading(true);
      });

      it('does not add a project if one still exists after a removal', () => {
        mockCartStore.state = { projects: [{ name: 'Project A', clientName: 'Ross Edfort' }] };
        serviceUnderTest = new CartService(mockCartStore, mockApi.injector, mockCurrentUserService);

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

      it('replaces the cart store with a new cart', () => {
        serviceUnderTest.purchaseOnCredit()
          .subscribe(_ => {
            expect(mockApi.get).toHaveBeenCalledWithApi(Api.Orders);
            expect(mockApi.get).toHaveBeenCalledWithEndpoint('cart');
            expect(mockApi.get).toHaveBeenCalledWithLoading(true);
            expect(mockCartStore.replaceWith).toHaveBeenCalled();
          });
      });
    });

    describe('editLineItem()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.editLineItem(mockLineItem, { selectedTranscodeTarget: '1080i' });

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('cart/update/lineItem/456');
        expect(mockApi.put).toHaveBeenCalledWithBody({ id: '456', price: 0, selectedTranscodeTarget: '1080i' });
      });

      it('replaces the cart store with the response', () => {
        serviceUnderTest.editLineItem(mockLineItem, { selectedTranscodeTarget: '1080i' });

        expect(mockCartStore.replaceWith).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });
  });
}
