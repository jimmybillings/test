import { CollectionsComponent } from './collections.component';
import { Observable } from 'rxjs/Observable';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Collections Component', () => {
    let componentUnderTest: CollectionsComponent;
    let mockCollectionsService: any, mockDialogService: any, mockUiConfig: any, mockCollectionContext: any,
      mockStore: any, activeCollectionSetter: jasmine.Spy;

    beforeEach(() => {
      mockCollectionsService = {
        getByIdAndDuplicate: jasmine.createSpy('getByIdAndDuplicate').and.returnValue(Observable.of({
          collection: {
            id: 123,
            assets: {
              items: [
                { id: 123, uuid: 'slkdjf-lskdjf', timeStart: 123, timeEnd: 456 },
                { id: 456, uuid: 'woieur-owisld', timeStart: -1, timeEnd: -2 }
              ]
            }
          }
        })),
        getItems: jasmine.createSpy('getItems').and.returnValue(Observable.of({
          data: {
            items: [
              { id: 123, uuid: 'slkdjf-lskdjf', timeStart: 123, timeEnd: 456 },
              { id: 456, uuid: 'woieur-owisld', timeStart: -1, timeEnd: -2 }
            ]
          }
        })),
        delete: jasmine.createSpy('delete').and.returnValue(Observable.of({})),
        load: jasmine.createSpy('load').and.returnValue(Observable.of({}))
      };
      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog')
      };
      mockCollectionContext = {
        data: Observable.of({ mockCollectionContext: 'mock data' }),
        updateCollectionOptions: jasmine.createSpy('updateCollectionOptions')
      };
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ some: 'item' }] } } }))
      };
      mockStore = new MockAppStore();
      mockStore.createStateSection('activeCollection', {
        collection: {
          id: 123,
          assets: {
            items: [
              { id: 123, other: 'stuff', timeStart: 123, timeEnd: 456 },
              { id: 456, other: 'stuff', timeStart: -1, timeEnd: -2 }
            ]
          },
          loaded: true
        }
      });
      activeCollectionSetter = mockStore.createActionFactoryMethod('activeCollection', 'set');
      componentUnderTest = new CollectionsComponent(null, mockCollectionsService, mockCollectionContext, null,
        mockUiConfig, null, mockDialogService, mockStore);
    });

    describe('activeCollection() - get', () => {
      it('Should return the current active collection', () => {
        componentUnderTest.activeCollection.subscribe(data => {
          expect(data).toEqual({
            id: 123,
            assets: {
              items: [
                { id: 123, other: 'stuff', timeStart: 123, timeEnd: 456 },
                { id: 456, other: 'stuff', timeStart: -1, timeEnd: -2 }
              ]
            },
            loaded: true
          });
        });
      });

      describe('toggleCollectionSearch()', () => {
        it('should toggle the boolean collectionSearchIsShowing variable', () => {
          expect(componentUnderTest.collectionSearchIsShowing).toEqual(false);
          componentUnderTest.toggleCollectionSearch();
          expect(componentUnderTest.collectionSearchIsShowing).toEqual(true);
        });
      });

      describe('selectActiveCollection()', () => {
        it('Should set the active collection with the id paramater supplied', () => {
          componentUnderTest.selectActiveCollection(1);
          expect(activeCollectionSetter).toHaveBeenCalledWith(1);
        });
      });

      describe('editCollection()', () => {
        it('Should call the dialog service to open the edit collection form in a dialog', () => {
          componentUnderTest.editCollection({ id: 123, name: 'Collection name', owner: 123 });
          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });
      });

      describe('createCollection()', () => {
        it('Should call the dialog service to open the edit collection form in a dialog', () => {
          componentUnderTest.createCollection();
          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });
      });

      describe('setCollectionForDelete()', () => {
        it('Should call the dialog service to open dialog which confirms delete', () => {
          componentUnderTest.setCollectionForDelete({ id: 123, name: 'test collection', owner: 123 });
          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });
      });

      describe('deleteCollection()', () => {
        it('Should call the dialog service to open dialog which confirms delete', () => {
          componentUnderTest.deleteCollection(1);
          expect(mockCollectionsService.delete).toHaveBeenCalledWith(1);
        });
      });

      describe('search()', () => {
        beforeEach(() => componentUnderTest.search('dogs'));
        it('Should update collection options on collectionContext', () => {

          expect(mockCollectionContext.updateCollectionOptions).toHaveBeenCalledWith({ currentSearchQuery: 'dogs' });
        });

        it('Should call the api to load collections with the specified search', () => {

          expect(mockCollectionsService.load).toHaveBeenCalledWith('dogs', true);
        });

      });

      describe('onFilterCollections()', () => {
        beforeEach(() => componentUnderTest.onFilterCollections({ access: 'owner' }));
        it('Should update collection options on collectionContext based on the passed in filter parameter', () => {

          expect(mockCollectionContext.updateCollectionOptions).toHaveBeenCalledWith({ currentFilter: { access: 'owner' } });
        });

        it('Should call the api to load collections with the specified filter', () => {

          expect(mockCollectionsService.load).toHaveBeenCalledWith('owner', true);
        });

      });

      describe('onSortCollections()', () => {
        beforeEach(() => componentUnderTest.onSortCollections({ sort: 'descending' }));
        it('Should update collection options on collectionContext based on the passed in sort parameter', () => {

          expect(mockCollectionContext.updateCollectionOptions).toHaveBeenCalledWith({ currentSort: { sort: 'descending' } });
        });

        it('Should call the api to load collections with the specified sort', () => {
          expect(mockCollectionsService.load).toHaveBeenCalledWith('descending', true);
        });

      });

      describe('isActiveCollection()', () => {

        it('Should true if the passed in id parameter matches that of the active collection', () => {
          expect(componentUnderTest.isActiveCollection(123)).toEqual(true);
        });

        it('Should false if the passed in id parameter matches that of the active collection', () => {
          expect(componentUnderTest.isActiveCollection(12)).toEqual(false);
        });

      });

      describe('getAssetsForLink()', () => {

        it('Should call the API to getItems with the correct collectionId', () => {
          componentUnderTest.getAssetsForLink(123);
          expect(mockCollectionsService.getItems).toHaveBeenCalledWith(123);

        });

        it('Should call the dialog service to open the collection link dialog', () => {
          componentUnderTest.getAssetsForLink(123);
          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });

      });

      describe('duplicateCollection()', () => {
        beforeEach(() => componentUnderTest.onDuplicateCollection(1));

        it('Should call the collection end point with the correct ID', () => {
          expect(mockCollectionsService.getByIdAndDuplicate).toHaveBeenCalledWith(1);
        });

        it('Should call the dialog service to open the duplicate collection form in a dialog', () => {
          expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
        });
      });
    });
  });
}
