import { Common } from '../../shared/utilities/common.functions';
import { FutureQuoteEditService } from './quote-edit.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Frame } from '../../shared/modules/wazee-frame-formatter/index';

export function main() {
  describe('Future Quote Edit Service', () => {
    let serviceUnderTest: FutureQuoteEditService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();

      serviceUnderTest = new FutureQuoteEditService(mockApiService.injector);
    });

    describe('load()', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.load();

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('quote/focused');
        expect(mockApiService.get).toHaveBeenCalledWithLoading(true);
      });

      it('returns an observable', () => {
        mockApiService.getResponse = { some: 'quote' };

        serviceUnderTest.load().subscribe(q => expect(q).toEqual({ some: 'quote' }));
      });
    });

    describe('delete()', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.delete(1);

        expect(mockApiService.delete).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApiService.delete).toHaveBeenCalledWithEndpoint('quote/1');
        expect(mockApiService.delete).toHaveBeenCalledWithLoading('onBeforeRequest');
      });

      it('switchMaps to a .load()', () => {
        let response: any;
        serviceUnderTest.delete(1).subscribe(res => response = res);

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('quote/focused');
        expect(mockApiService.get).toHaveBeenCalledWithLoading(true);

        expect(response).toEqual(mockApiService.getResponse);
      });
    });

    describe('editLineItemFromDetails()', () => {
      describe('calls the api service correctly', () => {
        it('when called with markers and attributes', () => {
          serviceUnderTest.editLineItemFromDetails(
            7,
            { id: 3, asset: { some: 'asset' } } as any,
            { in: new Frame(30).setFromFrameNumber(30), out: new Frame(30).setFromFrameNumber(60) },
            { some: 'attribute' }
          );

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/7/update/lineItem/3');
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 3,
            asset: { some: 'asset', timeStart: 1000, timeEnd: 2000 },
            attributes: [
              { priceAttributeName: 'some', selectedAttributeValue: 'attribute' }
            ]
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
        });

        it('when just called with attributes', () => {
          serviceUnderTest.editLineItemFromDetails(
            7,
            { id: 3, asset: { some: 'asset', timeStart: 333, timeEnd: 999 } } as any,
            null,
            { some: 'attribute' }
          );

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/7/update/lineItem/3');
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 3,
            asset: { some: 'asset', timeStart: 333, timeEnd: 999 },
            attributes: [
              { priceAttributeName: 'some', selectedAttributeValue: 'attribute' }
            ]
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
        });

        it('when just called with markers', () => {
          serviceUnderTest.editLineItemFromDetails(
            7,
            {
              id: 3,
              asset: { some: 'asset' }
            } as any,
            { in: new Frame(30).setFromFrameNumber(30), out: new Frame(30).setFromFrameNumber(60) },
            null
          );

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/7/update/lineItem/3');
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 3,
            asset: { some: 'asset', timeStart: 1000, timeEnd: 2000 },
            attributes: []
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
        });
      });

      describe('removeAsset()', () => {
        it('calls the API correctly', () => {
          serviceUnderTest.removeAsset(123, { uuid: 'ABCD' });

          expect(mockApiService.delete).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.delete).toHaveBeenCalledWithEndpoint('quote/123/asset/ABCD');
          expect(mockApiService.delete).toHaveBeenCalledWithLoading(true);
        });
      });

      describe('addCustomPriceToLineItem', () => {
        it('calls the apiService correctly', () => {
          serviceUnderTest.addCustomPriceToLineItem(10, { id: 'abc-123', itemPrice: 100 } as any, 1000);

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/10/update/lineItem/abc-123');
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 'abc-123',
            itemPrice: 100,
            multiplier: 10
          });
          expect(mockApiService.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
          expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
        });
      });

      describe('sendQuote', () => {
        it('should call the api service correctly', () => {
          serviceUnderTest.sendQuote(3, {
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z',
            purchaseType: 'ProvisionalOrder'
          }).take(1).subscribe();
          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/send/3');
          expect(mockApiService.put).toHaveBeenCalledWithParameters({
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z',
            purchaseType: 'ProvisionalOrder'
          });
        });

        it('should omit the purchaseType parameter if the purchase type is Standard', () => {
          serviceUnderTest.sendQuote(3, {
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z',
            purchaseType: 'Standard'
          }).take(1).subscribe();
          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/send/3');
          expect(mockApiService.put).toHaveBeenCalledWithParameters({
            ownerEmail: 'ross.edfort@wazeedigital.com',
            expirationDate: '2017-03-22T06:00:00.000Z'
          });
        });
      });

      describe('cloneQuote()', () => {
        const mockState: any = { data: { id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }] } };
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
            expect(mockApiService.post).toHaveBeenCalledWithApi(Api.Orders);
            expect(mockApiService.post).toHaveBeenCalledWithEndpoint('quote');
            expect(mockApiService.post).toHaveBeenCalledWithLoading(true);
            expect(mockApiService.post).toHaveBeenCalledWithBody({
              data: {
                total: 90,
                subTotal: 100,
                projects: [{ name: 'Project A' }]
              }
            });
          });
        });
      });

      describe('createQuote()', () => {
        it('calls the API service correctly', () => {
          serviceUnderTest.createQuote().subscribe(() => {
            expect(mockApiService.post).toHaveBeenCalledWithApi(Api.Orders);
            expect(mockApiService.post).toHaveBeenCalledWithEndpoint('quote');
            expect(mockApiService.post).toHaveBeenCalledWithLoading(true);
          });
        });
      });

      describe('updateQuoteField()', () => {
        it('should call the API service correctly - add', () => {
          serviceUnderTest.updateQuoteField(
            { field: 'somefield' },
            {
              id: 3, ownerUserId: 10, total: 90, subTotal: 100, bulkOrderId: 'abc-123', projects: [{ name: 'Project A' }]
            } as any);

          const expectedBody = Object.assign(
            {
              id: 3, ownerUserId: 10, total: 90, subTotal: 100, bulkOrderId: 'abc-123', projects: [{ name: 'Project A' }],
              field: 'somefield'
            }
          );

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/3');
          expect(mockApiService.put).toHaveBeenCalledWithBody(expectedBody);
        });

        it('should call the API service correctly - remove', () => {
          serviceUnderTest.updateQuoteField(
            { bulkOrderId: '' },
            {
              id: 3, ownerUserId: 10, total: 90, subTotal: 100, bulkOrderId: 'abc-123', projects: [{ name: 'Project A' }]
            } as any);

          expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.put).toHaveBeenCalledWithEndpoint('quote/3');
          expect(mockApiService.put).toHaveBeenCalledWithBody({
            id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }]
          });
        });
      });
    });
  });
}




// import { QuoteEditService } from './quote-edit.service';
// import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
// import { Api } from '../interfaces/api.interface';
// import { Observable } from 'rxjs/Observable';
// import { Frame } from '../modules/wazee-frame-formatter/index';
// import { Common } from '../utilities/common.functions';
// import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

// export function main() {
//   describe('Quote Edit Service', () => {
//     let serviceUnderTest: QuoteEditService, mockApi: MockApiService, mockStore: MockAppStore, mockFeeConfigStore: any,
//       mockRouter: any, quoteLoadSuccessSpy: jasmine.Spy;

//     const mockState: any = { data: { id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }] } };

//     beforeEach(() => {
//       mockApi = new MockApiService();
//       mockStore = new MockAppStore();
//       mockStore.createStateSection('quoteEdit', mockState);
//       quoteLoadSuccessSpy = mockStore.createActionFactoryMethod('quoteEdit', 'loadSuccess');
//       mockFeeConfigStore = {};
//       jasmine.addMatchers(mockApiMatchers);
//       mockRouter = { navigate: jasmine.createSpy('navigate') };

//       serviceUnderTest = new QuoteEditService(mockStore, mockFeeConfigStore, mockApi.injector);
//     });

//     describe('Store Accessors', () => {
//       describe('get data', () => {
//         it('should return an observable of the data from the store', () => {
//           serviceUnderTest.data.subscribe(d => expect(d).toEqual(mockState));
//         });
//       });

//       describe('get state', () => {
//         it('shold return the state from the store', () => {
//           expect(serviceUnderTest.state).toEqual(mockState);
//         });
//       });

//       describe('get quote', () => {
//         it('should return an observable of the quote in the store', () => {
//           serviceUnderTest.quote.subscribe(d => expect(d).toEqual(mockState.data));
//         });
//       });

//       describe('get projects', () => {
//         it('should return an observable of the projects in the store', () => {
//           serviceUnderTest.projects.subscribe(d => expect(d).toEqual(mockState.data.projects));
//         });
//       });

//       describe('get total', () => {
//         it('shold return an observable of the total in the store', () => {
//           serviceUnderTest.total.subscribe(d => expect(d).toBe(90));
//         });
//       });

//       describe('get subTotal', () => {
//         it('shold return an observable of the subTotal in the store', () => {
//           serviceUnderTest.subTotal.subscribe(d => expect(d).toBe(100));
//         });
//       });

//       describe('get hasAssets', () => {
//         it('should return false if the quote does not have the itemCount property', () => {
//           mockStore.createStateSection('quoteEdit', { data: {} });

//           new QuoteEditService(mockStore, null, null).hasAssets.subscribe(d => expect(d).toBe(false));
//         });

//         it('should return false if the quote itemCount is 0', () => {
//           mockStore.createStateSection('quoteEdit', { data: { itemCount: 0 } });

//           new QuoteEditService(mockStore, null, null).hasAssets.subscribe(d => expect(d).toBe(false));
//         });

//         it('should return true if the quote itemCount is greater than 0', () => {
//           mockStore.createStateSection('quoteEdit', { data: { itemCount: 1 } });

//           new QuoteEditService(mockStore, null, null).hasAssets.subscribe(d => expect(d).toBe(true));
//         });
//       });

//       describe('get quoteId', () => {
//         it('should return the quoteId', () => {
//           expect(serviceUnderTest.quoteId).toBe(3);
//         });
//       });

//       describe('hasProperty', () => {
//         it('should return the value of the property if the property exists', () => {
//           serviceUnderTest.hasProperty('total').subscribe(d => expect(d).toBe(90));
//         });

//         it('should return the undefined if the property doesnt exist', () => {
//           serviceUnderTest.hasProperty('bogusProperty').subscribe(d => expect(d).toBe(undefined));
//         });
//       });
//     });

//     describe('addProject()', () => {
//       it('calls the API service correctly', () => {
//         serviceUnderTest.addProject();

//         expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote/3/project');
//         expect(mockApi.post).toHaveBeenCalledWithLoading(true);
//       });

//       it('replaces the quote store with the response', () => {
//         serviceUnderTest.addProject();

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.postResponse);
//       });
//     });

//     describe('createQuote()', () => {
//       it('calls the API service correctly', () => {
//         serviceUnderTest.createQuote().subscribe(() => {
//           expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
//           expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
//           expect(mockApi.post).toHaveBeenCalledWithLoading(true);
//         });
//       });

//       it('replaces the quote store with the response of the newly created quote', () => {
//         serviceUnderTest.createQuote().subscribe(() => {
//           expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.postResponse);
//         });
//       });
//     });

//     describe('cloneQuote()', () => {
//       it(`Should call the deletePropertiesFromObject() method with a seperate cloned version
//       of the current quote`, () => {
//           spyOn(Common, 'deletePropertiesFromObject');
//           serviceUnderTest.cloneQuote(mockState);
//           expect(Common.deletePropertiesFromObject).toHaveBeenCalledWith(
//             mockState,
//             ['id', 'createdUserId', 'ownerUserId', 'createdOn', 'lastUpdated', 'expirationDate', 'quoteStatus']
//           );
//         });
//       it('calls the API service correctly', () => {
//         serviceUnderTest.cloneQuote(mockState).subscribe(() => {
//           expect(mockApi.post).toHaveBeenCalledWithApi(Api.Orders);
//           expect(mockApi.post).toHaveBeenCalledWithEndpoint('quote');
//           expect(mockApi.post).toHaveBeenCalledWithLoading(true);
//           expect(mockApi.post).toHaveBeenCalledWithBody({
//             data: {
//               total: 90,
//               subTotal: 100,
//               projects: [{ name: 'Project A' }]
//             }
//           });
//         });
//       });

//       it('replaces the quote store with the response of the newly created quote', () => {
//         serviceUnderTest.cloneQuote(mockState).subscribe(() => {
//           expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.postResponse);
//         });
//       });
//     });

//     describe('removeProject()', () => {
//       it('should call the API service correctly', () => {
//         serviceUnderTest.removeProject({ id: '123' } as any);

//         expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.delete).toHaveBeenCalledWithEndpoint('quote/3/project/123');
//         expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
//       });

//       it('replace the quote store with the response', () => {
//         serviceUnderTest.removeProject({ id: '123' } as any);

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.deleteResponse);
//       });
//     });

//     describe('addAssetToProjectInQuote()', () => {
//       let snackbarSpy: jasmine.Spy;

//       beforeEach(() => {
//         snackbarSpy = mockStore.createActionFactoryMethod('snackbar', 'display');
//       });

//       it('should call the API service correctly', () => {
//         serviceUnderTest.addAssetToProjectInQuote({
//           lineItem: { id: '123', asset: { assetId: 456 } }, attributes: { Distribution: 'Online Streaming' }
//         });

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/asset/lineItem');
//         expect(mockApi.put).toHaveBeenCalledWithBody({
//           lineItem: { id: '123', asset: { assetId: 456, timeStart: -1, timeEnd: -2 } },
//           attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
//         });
//         expect(mockApi.put).toHaveBeenCalledWithParameters({
//           projectName: 'Project A',
//           region: 'AAA'
//         });
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });

//       it('sends timeStart and timeEnd if defined', () => {
//         serviceUnderTest.addAssetToProjectInQuote({
//           lineItem: { id: '123', asset: { assetId: 456, timeStart: 33, timeEnd: 66 } },
//           attributes: { Distribution: 'Online Streaming' }
//         });

//         expect(mockApi.put).toHaveBeenCalledWithBody({
//           lineItem: { id: '123', asset: { assetId: 456, timeStart: 33, timeEnd: 66 } },
//           attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
//         });
//       });

//       it('sends timeStart and timeEnd if defined as markers', () => {
//         serviceUnderTest.addAssetToProjectInQuote({
//           lineItem: { id: '123', asset: { assetId: 456 } },
//           markers: { in: new Frame(30).setFromSeconds(10), out: new Frame(30).setFromSeconds(20) },
//           attributes: { Distribution: 'Online Streaming' }
//         });

//         expect(mockApi.put).toHaveBeenCalledWithBody({
//           lineItem: { id: '123', asset: { assetId: 456, timeStart: 10000, timeEnd: 20000 } },
//           attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
//         });
//       });

//       it('overrides asset timeStart and timeEnd with markers if both are defined', () => {
//         serviceUnderTest.addAssetToProjectInQuote({
//           lineItem: { id: '123', asset: { assetId: 456, timeStart: 33, timeEnd: 66 } },
//           markers: { in: new Frame(30).setFromSeconds(10), out: new Frame(30).setFromSeconds(20) },
//           attributes: { Distribution: 'Online Streaming' }
//         });

//         expect(mockApi.put).toHaveBeenCalledWithBody({
//           lineItem: { id: '123', asset: { assetId: 456, timeStart: 10000, timeEnd: 20000 } },
//           attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
//         });
//       });

//       it('replace the quote store with the response', () => {
//         serviceUnderTest.addAssetToProjectInQuote({ lineItem: { id: '123', asset: { assetId: 456 } } });

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
//       });

//       it('displays a snackbar with the expected message', () => {
//         serviceUnderTest.addAssetToProjectInQuote({ lineItem: { id: '123', asset: { assetId: 456 } } });

//         expect(snackbarSpy).toHaveBeenCalledWith('ASSET.ADD_TO_QUOTE_TOAST', { assetId: 456 });
//       });
//     });

//     describe('updateProject()', () => {
//       it('call the API service correctly', () => {
//         serviceUnderTest.updateProject({ name: 'New Project Name' } as any);

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/project');
//         expect(mockApi.put).toHaveBeenCalledWithBody({ name: 'New Project Name' });
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });

//       it('replace the quote store with the response', () => {
//         serviceUnderTest.updateProject({ name: 'New Project Name' } as any);

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
//       });
//     });

//     describe('updateProjectPriceAttributes()', () => {
//       it('should call the API service correctly', () => {
//         serviceUnderTest.updateProjectPriceAttributes(
//           { priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' },
//           { id: '123', name: 'Project A', clientName: 'Ross Edfort', subtotal: 100 }
//         );

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/project/priceAttributes/123');
//         expect(mockApi.put).toHaveBeenCalledWithBody(
//           { priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }
//         );
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });

//       it('replace the quote store with the response', () => {
//         serviceUnderTest.updateProjectPriceAttributes(
//           { priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' },
//           { id: '123', name: 'Project A', clientName: 'Ross Edfort', subtotal: 100 }
//         );

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
//       });
//     });

//     describe('moveLineItemTo()', () => {
//       it('call the API service correctly', () => {
//         serviceUnderTest.moveLineItemTo({ id: '123' } as any, { id: '456' } as any);

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/move/lineItem');
//         expect(mockApi.put).toHaveBeenCalledWithParameters({ lineItemId: '456', projectId: '123' });
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });

//       it('replace the quote store with the response', () => {
//         serviceUnderTest.moveLineItemTo({ id: '123' } as any, { id: '456' } as any);

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
//       });
//     });

//     describe('cloneLineItem()', () => {
//       it('should call the API service correctly', () => {
//         serviceUnderTest.cloneLineItem({ id: '123' });

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/clone/lineItem');
//         expect(mockApi.put).toHaveBeenCalledWithParameters({ lineItemId: '123' });
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });

//       it('replace the quote store with the response', () => {
//         serviceUnderTest.cloneLineItem({ id: '123' });

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
//       });
//     });

//     describe('editLineItem()', () => {
//       it('should call the API service correctly', () => {
//         serviceUnderTest.editLineItem({ id: '123' }, { pricingAttributes: { Distribution: 'Online Streaming' } });

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/update/lineItem/123');
//         expect(mockApi.put).toHaveBeenCalledWithBody({
//           id: '123', attributes: [{ priceAttributeName: 'Distribution', selectedAttributeValue: 'Online Streaming' }]
//         });
//         expect(mockApi.put).toHaveBeenCalledWithParameters({ region: 'AAA' });
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });

//       it('should replace the quote store with the response', () => {
//         serviceUnderTest.editLineItem({ id: '123' }, { pricingAttributes: { Distribution: 'Online Streaming' } });

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
//       });
//     });

//     describe('updateQuoteField()', () => {
//       it('should call the API service correctly - add', () => {
//         serviceUnderTest.updateQuoteField({ bulkOrderId: 'abc-123' });

//         const expectedBody = Object.assign(
//           { id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }] },
//           { bulkOrderId: 'abc-123' }
//         );

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');
//         expect(mockApi.put).toHaveBeenCalledWithBody(expectedBody);
//       });

//       it('should call the API service correctly - remove', () => {
//         mockStore = new MockAppStore();
//         mockStore.createStateSection('quoteEdit', {
//           data: { id: 3, ownerUserId: 10, total: 90, subTotal: 100, bulkOrderId: 'abc-123', projects: [{ name: 'Project A' }] }
//         });

//         serviceUnderTest.updateQuoteField({ bulkOrderId: '' });

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3');
//         expect(mockApi.put).toHaveBeenCalledWithBody({
//           id: 3, ownerUserId: 10, total: 90, subTotal: 100, projects: [{ name: 'Project A' }]
//         });
//       });

//       it('should replace the quote store with the response', () => {
//         serviceUnderTest.updateQuoteField({ bulkOrderId: 'abc-123' });

//         expect(quoteLoadSuccessSpy).toHaveBeenCalledWith(mockApi.putResponse);
//       });
//     });

//     describe('addFeeTo()', () => {
//       it('calls the API service as expected', () => {
//         serviceUnderTest.addFeeTo({ some: 'project', name: 'projectName' } as any, { some: 'fee' } as any);

//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/fee/lineItem');
//         expect(mockApi.put).toHaveBeenCalledWithBody({ some: 'fee' });
//         expect(mockApi.put).toHaveBeenCalledWithParameters({ projectName: 'projectName' });
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });

//       it('replaces the current quote', () => {
//         serviceUnderTest.addFeeTo({ some: 'project', name: 'projectName' } as any, { some: 'fee' } as any);

//         expect(quoteLoadSuccessSpy).toHaveBeenCalled();
//       });
//     });


//     describe('removeFee()', () => {
//       it('calls the API service as expected', () => {
//         serviceUnderTest.removeFee({ some: 'fee', id: 47 } as any);

//         expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.delete).toHaveBeenCalledWithEndpoint('quote/3/fee/47');
//         expect(mockApi.delete).toHaveBeenCalledWithLoading(true);
//       });

//       it('replaces the current quote', () => {
//         serviceUnderTest.removeFee({ some: 'fee', id: 47 } as any);

//         expect(quoteLoadSuccessSpy).toHaveBeenCalled();
//       });
//     });

//     describe('feeconfig getter', () => {
//       describe('when the FeeConfig store is initialized', () => {
//         beforeEach(() => {
//           mockFeeConfigStore.initialized = true;
//           mockFeeConfigStore.feeConfig = { existing: 'feeConfig' };
//         });

//         it('returns an Observable of the existing FeeConfig store', () => {
//           expect(serviceUnderTest.feeConfig).toEqual(Observable.of({ existing: 'feeConfig' }));
//         });
//       });

//       describe('when the FeeConfig store is not initialized', () => {
//         beforeEach(() => {
//           mockFeeConfigStore.initialized = false;
//           mockFeeConfigStore.replaceFeeConfigWith = jasmine.createSpy('replaceFeeConfigWith');
//           mockApi.getResponse = { loaded: 'feeConfig' };
//         });

//         it('calls the server\'s feeconfig endpoint as expected', () => {
//           serviceUnderTest.feeConfig.subscribe();

//           expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
//           expect(mockApi.get).toHaveBeenCalledWithEndpoint('feeConfig/search');
//           expect(mockApi.get).not.toHaveBeenCalledWithBody();
//           expect(mockApi.get).not.toHaveBeenCalledWithParameters();
//           expect(mockApi.get).toHaveBeenCalledWithLoading(true);
//         });

//         it('replaces the contents of the FeeConfig store', () => {
//           serviceUnderTest.feeConfig.subscribe(response => {
//             expect(mockFeeConfigStore.replaceFeeConfigWith).toHaveBeenCalledWith({ loaded: 'feeConfig' });
//           });
//         });

//         it('returns an Observable of the server\'s returned FeeConfig', () => {
//           serviceUnderTest.feeConfig.subscribe(response => {
//             expect(response).toEqual({ loaded: 'feeConfig' });
//           });
//         });
//       });
//     });

//     describe('bulkImport', () => {
//       it('calls the api service correctly', () => {
//         serviceUnderTest.bulkImport({ lineItemAttributes: 'one\ntwo' }, 'abc-123');
//         expect(mockApi.put).toHaveBeenCalledWithApi(Api.Orders);
//         expect(mockApi.put).toHaveBeenCalledWithEndpoint('quote/3/asset/direct/lineItem');
//         expect(mockApi.put).toHaveBeenCalledWithBody({ lineItemAttributes: 'one\ntwo' });
//         expect(mockApi.put).toHaveBeenCalledWithParameters({ projectId: 'abc-123' });
//         expect(mockApi.put).toHaveBeenCalledWithLoading(true);
//       });
//     });
//   });
// }
