import {
  beforeEachProvidersArray,
  Observable,
  Injectable,
  inject,
  TestBed
} from '../../../imports/test.imports';

import { CollectionFormComponent } from './collection-form.component';
import { CollectionsService } from '../../../shared/services/collections.service';
import { ActiveCollectionService } from '../../../shared/services/active-collection.service';

export function main() {
  describe('Collection Form component', () => {
    @Injectable()
    class MockCollectionsService {
      public data: Observable<any>;
      constructor() {
        this.data = Observable.of(mockCollections());
      }
      public create(collection: any): Observable<any> {
        return Observable.of(mockCollection());
      }
      public createCollectionInStore(collection: any): any {
        return true;
      }
      public updateFocusedCollection(collection: any): any {
        return true;
      }
    }

    class MockActiveCollectionService {
      public data: Observable<any>;
      constructor() {
        this.data = Observable.of({ id: 1 });
      }
      load() {
        return Observable.of({ id: 2 });
      }
      set() {
        return Observable.of({});
      }

      getItems() {
        return Observable.of({});
      }
    }

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        CollectionFormComponent,
        { provide: CollectionsService, useClass: MockCollectionsService },
        { provide: ActiveCollectionService, useClass: MockActiveCollectionService }
      ]
    }));

    it('Should create a new collection',
      inject([CollectionFormComponent], (component: CollectionFormComponent) => {
        component.dialog = {};
        component.dialog.close = function () { return true; };
        spyOn(component.collections, 'create').and.callThrough();
        spyOn(component.activeCollection, 'load').and.callThrough();
        spyOn(component, 'loadCollections');
        component.createCollection(mockCollection());
        let collectionWithParsedTags = mockCollection();
        collectionWithParsedTags.tags = ['cat', 'dog', 'cow'];
        expect(component.loadCollections).toHaveBeenCalled();
        expect(component.collections.create).toHaveBeenCalledWith(collectionWithParsedTags);
        expect(component.activeCollection.load).toHaveBeenCalled();
      }));

    // it('Should return type ahead suggestions matching input',
    //   inject([CollectionFormComponent], (component: CollectionFormComponent) => {
    //     expect(component.getSuggestions('maui', mockCollections()))
    //       .toEqual(['Maui Hawaii', 'Maui Hawaii +25', 'Maui Hawaii five-o', 'Maui Hawaii five-99', 'Maui Hawaii testing']);
    //   }));

    // it('Should be able to use down arrow key to navigate type ahead suggestion list',
    //   inject([CollectionFormComponent], (component: CollectionFormComponent) => {
    //     spyOn(component, 'inputKeyDown').and.callThrough();
    //     spyOn(component, 'setActiveSuggestion');
    //     spyOn(component, 'getActiveSuggestionIndex');
    //     component.inputKeyDown(mockKeyboardEventDownArrow());
    //     expect(component.getActiveSuggestionIndex).toHaveBeenCalled();
    //     expect(component.setActiveSuggestion).toHaveBeenCalled();
    //   }));
  });
}

function mockCollection(): any {
  return {
    createdOn: 'today',
    lastUpdated: 'today',
    id: 2,
    siteName: 'core',
    name: 'james billings',
    owner: 'james.billings@wazeedigital.com',
    tags: 'cat, dog, cow'
  };
}

function mockCollections(): any {
  return {
    'items': [
      {
        'id': 196,
        'name': 'Taxi Cabs', 'owner': 62,
        'email': 'jeff+2@jeffhyde.com',
        'userRole': 'owner',
        'tags': ['cabs', 'taxi', 'france'],
        'assetsCount': 24,
        'createdOn': '2016-06-21T18:15:28Z',
        'lastUpdated': '2016-07-15T00:07:08Z',
      }]
  };
}

// function mockKeyboardEventDownArrow(): any {
//   return { 'keyCode': 40 };
// }
