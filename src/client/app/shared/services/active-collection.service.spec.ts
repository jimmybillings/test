import { ActiveCollectionService } from './active-collection.service';
import { Observable } from 'rxjs/Rx';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Collection } from '../interfaces/collection.interface';

export function main() {
  describe('Active Collection Service', () => {
    let serviceUnderTest: ActiveCollectionService, mockApi: MockApiService, mockStore: any, collection: Collection;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);

      mockApi = new MockApiService();
      collection = { id: 1, createdOn: '123', lastUpdated: '456', siteName: 'core', name: 'cats', owner: 25 };
      mockStore = {
        data: Observable.of(collection),
        state: collection,
        reset: jasmine.createSpy('reset'),
        updateTo: jasmine.createSpy('updateTo'),
        updateAssetsTo: jasmine.createSpy('updateAssetsTo')
      };
      serviceUnderTest = new ActiveCollectionService(mockStore, mockApi.injector);
    });

    describe('OnInit', () => {
      it('should set the searchParams', () => {
        serviceUnderTest.ngOnInit();

        expect(serviceUnderTest.params).toEqual({ 's': '', 'd': '', 'i': '0', 'n': '50' });
      });
    });

    describe('Data and state getters', () => {
      it('state should call state on the store and return a collection', () => {
        expect(serviceUnderTest.state).toEqual(collection);
      });

      it('data should call data on the store and return an observable of a collection', () => {
        expect(serviceUnderTest.data).toEqual(Observable.of(collection));
      });
    });

    describe('resetStore', () => {
      it('should call .reset() on the store', () => {
        serviceUnderTest.resetStore();

        expect(mockStore.reset).toHaveBeenCalled();
      });
    });

    describe('isActiveCollection', () => {
      it('should return true when the collectionId passed in matches the one in the store', () => {
        expect(serviceUnderTest.isActiveCollection(1)).toBe(true);
      });

      it('should return false when the collectionId passed in does not mathc the one in the store', () => {
        expect(serviceUnderTest.isActiveCollection(123)).toBe(false);
      });
    });

    describe('load', () => {
      it('should get the focusedCollection summary if a collectionId is not passed in', () => {
        serviceUnderTest.load();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('collectionSummary/focused');
        expect(mockApi.get).toHaveBeenCalledWithLoading();
      });

      it('should call updateTo on the store with the response', () => {
        serviceUnderTest.load().take(1).subscribe((response: any) => {
          expect(mockStore.updateTo).toHaveBeenCalledWith(mockApi.getResponse);
        });
      });

      it('should call getItems with the response id', () => {
        spyOn(serviceUnderTest, 'getItems');
        mockApi.getResponse = collection;
        serviceUnderTest.load().take(1).subscribe((response: Collection) => {
          expect(serviceUnderTest.getItems).toHaveBeenCalledWith(1, {i: 1, n: 100 });
        });
      });
    });
  });
}