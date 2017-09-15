import { QuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Observable } from 'rxjs/Observable';
import { Frame } from 'wazee-frame-formatter';
import { Common } from '../utilities/common.functions';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Quote Edit Service', () => {
    let serviceUnderTest: QuoteEditService, mockApi: MockApiService, mockStore: MockAppStore, mockFeeConfigStore: any,
      mockRouter: any, quoteLoadSuccessSpy: jasmine.Spy;

    const mockState: any = { data: { id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }] } };

    beforeEach(() => {
      mockApi = new MockApiService();
      mockStore = new MockAppStore();
      mockStore.createStateSection('quoteEdit', mockState);
      quoteLoadSuccessSpy = mockStore.createActionFactoryMethod('quoteEdit', 'loadSuccess');
      mockFeeConfigStore = {};
      jasmine.addMatchers(mockApiMatchers);
      mockRouter = { navigate: jasmine.createSpy('navigate') };

      serviceUnderTest = new QuoteEditService(mockStore, mockFeeConfigStore, mockApi.injector);
    });

    describe('Store Accessors', () => {
      describe('get data', () => {
        it('should return an observable of the data from the store', () => {
          serviceUnderTest.data.subscribe(d => expect(d).toEqual(mockState));
        });
      });

      describe('get state', () => {
        it('shold return the state from the store', () => {
          expect(serviceUnderTest.state).toEqual(mockState);
        });
      });

      describe('get quote', () => {
        it('should return an observable of the quote in the store', () => {
          serviceUnderTest.quote.subscribe(d => expect(d).toEqual(mockState.data));
        });
      });

      describe('get projects', () => {
        it('should return an observable of the projects in the store', () => {
          serviceUnderTest.projects.subscribe(d => expect(d).toEqual(mockState.data.projects));
        });
      });

      describe('get total', () => {
        it('shold return an observable of the total in the store', () => {
          serviceUnderTest.total.subscribe(d => expect(d).toBe(90));
        });
      });

      describe('get subTotal', () => {
        it('shold return an observable of the subTotal in the store', () => {
          serviceUnderTest.subTotal.subscribe(d => expect(d).toBe(100));
        });
      });

      describe('get hasAssets', () => {
        it('should return false if the quote does not have the itemCount property', () => {
          mockStore.createStateSection('quoteEdit', { data: {} });

          new QuoteEditService(mockStore, null, null).hasAssets.subscribe(d => expect(d).toBe(false));
        });

        it('should return false if the quote itemCount is 0', () => {
          mockStore.createStateSection('quoteEdit', { data: { itemCount: 0 } });

          new QuoteEditService(mockStore, null, null).hasAssets.subscribe(d => expect(d).toBe(false));
        });

        it('should return true if the quote itemCount is greater than 0', () => {
          mockStore.createStateSection('quoteEdit', { data: { itemCount: 1 } });

          new QuoteEditService(mockStore, null, null).hasAssets.subscribe(d => expect(d).toBe(true));
        });
      });

      describe('get quoteId', () => {
        it('should return the quoteId', () => {
          expect(serviceUnderTest.quoteId).toBe(3);
        });
      });

      describe('hasProperty', () => {
        it('should return the value of the property if the property exists', () => {
          serviceUnderTest.hasProperty('total').subscribe(d => expect(d).toBe(90));
        });

        it('should return the undefined if the property doesnt exist', () => {
          serviceUnderTest.hasProperty('bogusProperty').subscribe(d => expect(d).toBe(undefined));
        });
      });
    });

    describe('addProject()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.addProject();

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote/3/project');
        expect(mockApi.post).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the quote store with the response', () => {
        serviceUnderTest.addProject();

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.postResponse);
      });
    });

    describe('createQuote()', () => {
      it('calls the API service correctly', () => {
        serviceUnderTest.createQuote().subscribe(() => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
        });
      });

      it('replaces the quote store with the response of the newly created quote', () => {
        serviceUnderTest.createQuote().subscribe(() => {
          expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.postResponse);
        });
      });
    });

    describe('cloneQuote()', () => {
      it(`Should call the deletePropertiesFromObject() method with a seperate cloned version
      of the current quote`, () => {
          spyOn(Common, 'deletePropertiesFromObject');
          serviceUnderTest.cloneQuote(mockState);
          expect(Common.deletePropertiesFromObject).toHaveBeenCalledWith(
            mockState,
            ['id', 'createdUserId', 'ownerUserId', 'createdOn', 'lastUpdated', 'expirationDate', 'quoteStatus']
          );
        });
      it('calls the API service correctly', () => {
        serviceUnderTest.cloneQuote(mockState).subscribe(() => {
          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
          expect(mockApi.post).toHaveBeenCalledWithLoading(true);
          expect(mockApi.post).toHaveBeenCalledWithBody({
            data: {
              total: 90,
              subTotal: 100,
              projects: [{ name: 'Project A' }]
            }
          });
        });
      });

      it('replaces the quote store with the response of the newly created quote', () => {
        serviceUnderTest.cloneQuote(mockState).subscribe(() => {
          expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.postResponse);
        });
      });
    });

    describe('removeProject()', () => {
      it('should call the API service correctly', () => {
        serviceUnderTest.removeProject({ id: '123' } as any);

        expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.delete).toHaveBeenCalledWithEndpoint('quote/3/project/123');
        expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
      });

      it('replace the quote store with the response', () => {
        serviceUnderTest.removeProject({ id: '123' } as any);

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.deleteResponse);
      });
    });

    describe('addAssetToProjectInQuote()', () => {
      it('should call the API service correctly', () => {
        serviceUnderTest.addAssetToProjectInQuote({
          lineItem: { id: '123', asset: { assetId: 456 } }, attributes: { Distribution: 'Online Streaming' }
        });

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/asset/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithBody({
          lineItem: { id: '123', asset: { assetId: 456, timeStart: -1, timeEnd: -2 } },
          attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
        });
        expect(mockApi.put).toHaveBeenCalledWithParameters({
          projectName: 'Project A',
          region: 'AAA'
        });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('sends timeStart and timeEnd if defined', () => {
        serviceUnderTest.addAssetToProjectInQuote({
          lineItem: { id: '123', asset: { assetId: 456, timeStart: 33, timeEnd: 66 } },
          attributes: { Distribution: 'Online Streaming' }
        });

        expect(mockApi.put).toHaveBeenCalledWithBody({
          lineItem: { id: '123', asset: { assetId: 456, timeStart: 33, timeEnd: 66 } },
          attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
        });
      });

      it('sends timeStart and timeEnd if defined as markers', () => {
        serviceUnderTest.addAssetToProjectInQuote({
          lineItem: { id: '123', asset: { assetId: 456 } },
          markers: { in: new Frame(30).setFromSeconds(10), out: new Frame(30).setFromSeconds(20) },
          attributes: { Distribution: 'Online Streaming' }
        });

        expect(mockApi.put).toHaveBeenCalledWithBody({
          lineItem: { id: '123', asset: { assetId: 456, timeStart: 10000, timeEnd: 20000 } },
          attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
        });
      });

      it('overrides asset timeStart and timeEnd with markers if both are defined', () => {
        serviceUnderTest.addAssetToProjectInQuote({
          lineItem: { id: '123', asset: { assetId: 456, timeStart: 33, timeEnd: 66 } },
          markers: { in: new Frame(30).setFromSeconds(10), out: new Frame(30).setFromSeconds(20) },
          attributes: { Distribution: 'Online Streaming' }
        });

        expect(mockApi.put).toHaveBeenCalledWithBody({
          lineItem: { id: '123', asset: { assetId: 456, timeStart: 10000, timeEnd: 20000 } },
          attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
        });
      });

      it('replace the quote store with the response', () => {
        serviceUnderTest.addAssetToProjectInQuote({ lineItem: { id: '123', asset: { assetId: 456 } } });

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });

    describe('updateProject()', () => {
      it('call the API service correctly', () => {
        serviceUnderTest.updateProject({ name: 'New Project Name' } as any);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/project');
        expect(mockApi.put).toHaveBeenCalledWithBody({ name: 'New Project Name' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replace the quote store with the response', () => {
        serviceUnderTest.updateProject({ name: 'New Project Name' } as any);

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });

    describe('updateProjectPriceAttributes()', () => {
      it('should call the API service correctly', () => {
        serviceUnderTest.updateProjectPriceAttributes(
          { priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' },
          { id: '123', name: 'Project A', clientName: 'Ross Edfort', subtotal: 100 }
        );

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/project/priceAttributes/123');
        expect(mockApi.put).toHaveBeenCalledWithBody(
          { priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }
        );
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replace the quote store with the response', () => {
        serviceUnderTest.updateProjectPriceAttributes(
          { priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' },
          { id: '123', name: 'Project A', clientName: 'Ross Edfort', subtotal: 100 }
        );

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });

    describe('moveLineItemTo()', () => {
      it('call the API service correctly', () => {
        serviceUnderTest.moveLineItemTo({ id: '123' } as any, { id: '456' } as any);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/move/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithParameters({ lineItemId: '456', projectId: '123' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replace the quote store with the response', () => {
        serviceUnderTest.moveLineItemTo({ id: '123' } as any, { id: '456' } as any);

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });

    describe('cloneLineItem()', () => {
      it('should call the API service correctly', () => {
        serviceUnderTest.cloneLineItem({ id: '123' });

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/clone/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithParameters({ lineItemId: '123' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replace the quote store with the response', () => {
        serviceUnderTest.cloneLineItem({ id: '123' });

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });

    describe('removeLineItem()', () => {
      it('should call the API service correctly', () => {
        serviceUnderTest.removeLineItem({ id: '123' });

        expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.delete).toHaveBeenCalledWithEndpoint('quote/3/asset/123');
        expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
      });

      it('should replace the store with the response', () => {
        serviceUnderTest.removeLineItem({ id: '123' });

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.deleteResponse);
      });
    });

    describe('editLineItem()', () => {
      it('should call the API service correctly', () => {
        serviceUnderTest.editLineItem({ id: '123' }, { pricingAttributes: { Distribution: 'Online Streaming' } });

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/update/lineItem/123');
        expect(mockApi.put).toHaveBeenCalledWithBody({
          id: '123', attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
        });
        expect(mockApi.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('should replace the quote store with the response', () => {
        serviceUnderTest.editLineItem({ id: '123' }, { pricingAttributes: { Distribution: 'Online Streaming' } });

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });

    describe('updateQuoteField()', () => {
      it('should call the API service correctly - add', () => {
        serviceUnderTest.updateQuoteField({ bulkOrderId: 'abc-123' });

        const expectedBody = Object.assign(
          { id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }] },
          { bulkOrderId: 'abc-123' }
        );

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');
        expect(mockApi.put).toHaveBeenCalledWithBody(expectedBody);
      });

      it('should call the API service correctly - remove', () => {
        mockStore = new MockAppStore();
        mockStore.createStateSection('quoteEdit', {
          data: { id: 3, ownerUserId: 10, total: 90, subTotal: 100, bulkOrderId: 'abc-123', projects: [{ name: 'Project A' }] }
        });

        serviceUnderTest.updateQuoteField({ bulkOrderId: '' });

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');
        expect(mockApi.put).toHaveBeenCalledWithBody({
          id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }]
        });
      });

      it('should replace the quote store with the response', () => {
        serviceUnderTest.updateQuoteField({ bulkOrderId: 'abc-123' });

        expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
      });
    });

    describe('sendQuote', () => {
      it('should call the api service correctly', () => {
        serviceUnderTest.sendQuote({
          ownerEmail: 'ross.edfort@wazeedigital.com',
          expirationDate: '2017-03-22T06:00:00.000Z',
          purchaseType: 'ProvisionalOrder'
        }).take(1).subscribe();
        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/send/3');
        expect(mockApi.put).toHaveBeenCalledWithParameters({
          ownerEmail: 'ross.edfort@wazeedigital.com',
          expirationDate: '2017-03-22T06:00:00.000Z',
          purchaseType: 'ProvisionalOrder'
        });
      });
    });

    describe('addFeeTo()', () => {
      it('calls the API service as expected', () => {
        serviceUnderTest.addFeeTo({ some: 'project', name: 'projectName' } as any, { some: 'fee' } as any);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/fee/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithBody({ some: 'fee' });
        expect(mockApi.put).toHaveBeenCalledWithParameters({ projectName: 'projectName' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the current quote', () => {
        serviceUnderTest.addFeeTo({ some: 'project', name: 'projectName' } as any, { some: 'fee' } as any);

        expect(quoteLoadSuccessSpy).toHaveBeenCalled();
      });
    });


    describe('removeFee()', () => {
      it('calls the API service as expected', () => {
        serviceUnderTest.removeFee({ some: 'fee', id: 47 } as any);

        expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.delete).toHaveBeenCalledWithEndpoint('quote/3/fee/47');
        expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
      });

      it('replaces the current quote', () => {
        serviceUnderTest.removeFee({ some: 'fee', id: 47 } as any);

        expect(quoteLoadSuccessSpy).toHaveBeenCalled();
      });
    });

    describe('feeconfig getter', () => {
      describe('when the FeeConfig store is initialized', () => {
        beforeEach(() => {
          mockFeeConfigStore.initialized = true;
          mockFeeConfigStore.feeConfig = { existing: 'feeConfig' };
        });

        it('returns an Observable of the existing FeeConfig store', () => {
          expect(serviceUnderTest.feeConfig).toEqual(Observable.of({ existing: 'feeConfig' }));
        });
      });

      describe('when the FeeConfig store is not initialized', () => {
        beforeEach(() => {
          mockFeeConfigStore.initialized = false;
          mockFeeConfigStore.replaceFeeConfigWith = jasmine.createSpy('replaceFeeConfigWith');
          mockApi.getResponse = { loaded: 'feeConfig' };
        });

        it('calls the server\'s feeconfig endpoint as expected', () => {
          serviceUnderTest.feeConfig.subscribe();

          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('feeConfig/search');
          expect(mockApi.get).not.toHaveBeenCalledWithBody();
          expect(mockApi.get).not.toHaveBeenCalledWithParameters();
          expect(mockApi.get).toHaveBeenCalledWithLoading(true);
        });

        it('replaces the contents of the FeeConfig store', () => {
          serviceUnderTest.feeConfig.subscribe(response => {
            expect(mockFeeConfigStore.replaceFeeConfigWith).toHaveBeenCalledWith({ loaded: 'feeConfig' });
          });
        });

        it('returns an Observable of the server\'s returned FeeConfig', () => {
          serviceUnderTest.feeConfig.subscribe(response => {
            expect(response).toEqual({ loaded: 'feeConfig' });
          });
        });
      });
    });

    describe('bulkImport', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.bulkImport({ lineItemAttributes: 'one\ntwo' }, 'abc-123');
        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/asset/direct/lineItem');
        expect(mockApi.put).toHaveBeenCalledWithBody({ lineItemAttributes: 'one\ntwo' });
        expect(mockApi.put).toHaveBeenCalledWithParameters({ projectId: 'abc-123' });
        expect(mockApi.put).toHaveBeenCalledWithLoading(true);
      });
    });
  });
}
