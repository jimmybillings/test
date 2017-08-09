import { Observable } from 'rxjs/Observable';

import { CollectionFormComponent } from './collection-form.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  let componentUnderTest: CollectionFormComponent, mockCollections: any, mockCollectionContext: any, mockActiveCollection: any;
  let mockStore: MockAppStore;

  describe('Collection Form Component', () => {
    beforeEach(() => {
      mockCollections = {
        create: jasmine.createSpy('create').and.returnValue(Observable.of({})),
        load: jasmine.createSpy('load').and.returnValue(Observable.of({}))
      };
      mockCollectionContext = { resetCollectionOptions: jasmine.createSpy('resetCollectionOptions') };
      mockStore = new MockAppStore();
      componentUnderTest =
        new CollectionFormComponent(mockCollections, null, null, mockCollectionContext, mockStore);
      componentUnderTest.dialog = { close: () => { } };
    });

    describe('createCollection()', () => {
      it('Should create a new collection', () => {
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'load');
        spyOn(componentUnderTest, 'loadCollections');
        componentUnderTest.createCollection(mockCollection());
        let collectionWithParsedTags = mockCollection();
        collectionWithParsedTags.tags = ['cat', 'dog', 'cow'];
        expect(componentUnderTest.loadCollections).toHaveBeenCalled();
        expect(componentUnderTest.collections.create).toHaveBeenCalledWith(collectionWithParsedTags);
        mockStore.expectDispatchFor(spy);
      });
    });
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


