import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  Observable,
  Injectable,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { CollectionFormComponent } from './collection-form.component';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';

export function main() {
  describe('Collection Form component', () => {
    @Injectable()
    class MockCollectionsService {
      public createCollection(collection: any): Observable<any> {
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
      get() {
        return Observable.of({id: 2});
      }
      set() {
        return Observable.of({});
      }

      getItems() {
        return Observable.of({});
      }
    }

    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      CollectionFormComponent,
      { provide: CollectionsService, useClass: MockCollectionsService },
      { provide: ActiveCollectionService, useClass: MockActiveCollectionService }
    ]);

    it('Create instance of collection form',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(CollectionFormComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof CollectionFormComponent).toBeTruthy();
        });
      }));

    it('Should create a new collection',
      inject([CollectionFormComponent], (component: CollectionFormComponent) => {
        spyOn(component, 'cancelCollectionCreation');
        spyOn(component.collectionsService, 'createCollection').and.callThrough();
        spyOn(component.activeCollection, 'set').and.callThrough();
        spyOn(component.activeCollection, 'getItems').and.callThrough();
        component.createCollection(mockCollection());
        let collectionWithParsedTags = mockCollection();
        collectionWithParsedTags.tags = ['cat', 'dog', 'cow'];
        expect(component.collectionsService.createCollection).toHaveBeenCalledWith(collectionWithParsedTags);
        expect(component.activeCollection.set).toHaveBeenCalledWith(mockCollection().id);
        expect(component.activeCollection.getItems).toHaveBeenCalledWith(mockCollection().id, 100);
        expect(component.cancelCollectionCreation).toHaveBeenCalled();
      }));

  });
}

function mockCollection(): any {
  return {
    createdOn: 'today',
    lastUpdated: 'today',
    id: 1,
    siteName: 'core',
    name: 'james billings',
    owner: 'james.billings@wazeedigital.com',
    tags: 'cat, dog, cow'
  };
}
