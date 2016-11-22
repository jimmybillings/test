import { CollectionsService } from './collections.service';
import { MockApiService, mockApiMatchers } from '../mocks/mock-api.service';
import { Api } from '../interfaces/api.interface';
import { Collection } from '../interfaces/collection.interface';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Collections service', () => {
    let serviceUnderTest: CollectionsService, mockStore: any, mockActiveCollection: any, mockApi: MockApiService, mockCollection: Collection;

    mockCollection = {
      'lastUpdated': '2016-06-17T21:44:12Z',
      'createdOn': '2016-06-17T21:44:12Z',
      'id': 158,
      'siteName': 'core',
      'name': 'golf',
      'owner': 33,
      'tags': ['golf', 'green', 'sport']
    };

    function isActiveCollection(id: number): boolean { return id === 123; }

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      mockActiveCollection = {
        load: jasmine.createSpy('load').and.returnValue(Observable.of({})),
        isActiveCollection: jasmine.createSpy('isActiveCollection').and.callFake(isActiveCollection),
        data: Observable.of({ id: 1 }),
        resetStore: jasmine.createSpy('resetStore')
      };
      mockStore = {
        deleteAllCollections: jasmine.createSpy('deleteAllCollections'),
        deleteCollectionWith: jasmine.createSpy('deleteCollectionWith'),
        add: jasmine.createSpy('add'),
        update: jasmine.createSpy('update'),
        replaceAllCollectionsWith: jasmine.createSpy('replaceAllCollectionsWith'),
        state: { items: [{ id: 1 }, { id: 2 }], pagination: {} },
        data: Observable.of({ items: [{ id: 1 }, { id: 2 }], pagination: {} })
      };
      serviceUnderTest = new CollectionsService(mockStore, mockApi.injector, mockActiveCollection);
    });

    it('should not sync if there are no collections', () => {
      mockStore = {
        deleteAllCollections: jasmine.createSpy('deleteAllCollections'),
        deleteCollectionWith: jasmine.createSpy('deleteCollectionWith'),
        add: jasmine.createSpy('add'),
        update: jasmine.createSpy('update'),
        replaceAllCollectionsWith: jasmine.createSpy('replaceAllCollectionsWith'),
        state: { items: [], pagination: {} },
        data: Observable.of({ items: [], pagination: {} })
      };
      serviceUnderTest = new CollectionsService(mockStore, mockApi.injector, mockActiveCollection);
      expect(mockStore.update).not.toHaveBeenCalled();
    });

    it('should have a data getter that returns an observable of the store\'s state', () => {
      serviceUnderTest.data.subscribe((data: any) => {
        expect(data).toEqual({ items: [{ id: 1 }, { id: 2 }], pagination: {} });
      });
    });

    it('should have a state getter that returns the store\'s state', () => {
      expect(serviceUnderTest.state).toEqual(mockStore.state);
    });

    describe('load()', () => {
      it('call the apiService correctly without arguments', () => {
        serviceUnderTest.load();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('collectionSummary/search');
        expect(mockApi.get).toHaveBeenCalledWithParameters({ q: '', accessLevel: 'all', s: '', d: '', i: 0, n: 200 });
        expect(mockApi.get).toHaveBeenCalledWithLoading(false);
      });

      it('call the apiService correctly with arguments', () => {
        serviceUnderTest.load({ q: 'ross', n: 20 }, true);

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('collectionSummary/search');
        expect(mockApi.get).toHaveBeenCalledWithParameters({ q: 'ross', accessLevel: 'all', s: '', d: '', i: 0, n: 20 });
        expect(mockApi.get).toHaveBeenCalledWithLoading(true);
      });

      it('should replace collections in the store with the response', () => {
        serviceUnderTest.load().take(1).subscribe();

        expect(mockStore.replaceAllCollectionsWith).toHaveBeenCalledWith(mockApi.getResponse);
      });
    });

    describe('create()', () => {
      it('should call the apiService correctly', () => {
        serviceUnderTest.create(mockCollection);

        expect(mockApi.post).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApi.post).toHaveBeenCalledWithEndpoint('collectionSummary');
        expect(mockApi.post).toHaveBeenCalledWithBody(mockCollection);
      });

      it('should add the response to the store', () => {
        serviceUnderTest.create(mockCollection).take(1).subscribe();

        expect(mockStore.add).toHaveBeenCalledWith(mockApi.postResponse);
      });
    });

    describe('update()', () => {
      it('should call the apiService correctly', () => {
        serviceUnderTest.update(mockCollection);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('collectionSummary/158');
        expect(mockApi.put).toHaveBeenCalledWithBody(mockCollection);
      });
    });

    describe('delete()', () => {
      it('should delete the corresponding collection from the store', () => {
        serviceUnderTest.delete(123);

        expect(mockStore.deleteCollectionWith).toHaveBeenCalledWith(123);
      });

      it('should call the apiService correctly', () => {
        serviceUnderTest.delete(123);

        expect(mockApi.delete).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.delete).toHaveBeenCalledWithEndpoint('collection/123');
      });

      it('should check if the collection being deleted is active', () => {
        serviceUnderTest.delete(123).take(1).subscribe();

        expect(mockActiveCollection.isActiveCollection).toHaveBeenCalledWith(123);
      });

      it('should call activeCollectionService.load() if the collection being deleted is active', () => {
        serviceUnderTest.delete(123).take(1).subscribe();

        expect(mockActiveCollection.load).toHaveBeenCalled();
      });

      it('should NOT call collectionsService.load() if the collection being deleted is NOT active', () => {
        serviceUnderTest.delete(1).take(1).subscribe();

        expect(mockActiveCollection.load).not.toHaveBeenCalled();
      });
    });

    describe('destroyAll()', () => {
      beforeEach(() => {
        serviceUnderTest.destroyAll();
      });

      it('should call deleteAllCollections() on the collections store', () => {
        expect(mockStore.deleteAllCollections).toHaveBeenCalled();
      });

      it('should call resetStore on the active collection store', () => {
        expect(mockActiveCollection.resetStore).toHaveBeenCalled();
      });
    });
  });
}