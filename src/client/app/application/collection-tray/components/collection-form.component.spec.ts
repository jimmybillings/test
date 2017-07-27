import { CollectionFormComponent } from './collection-form.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  let componentUnderTest: CollectionFormComponent, mockCollections: any, mockCollectionContext: any, mockActiveCollection: any;

  describe('Collection Form Component', () => {
    beforeEach(() => {
      mockCollections = {
        create: jasmine.createSpy('create').and.returnValue(Observable.of({})),
        load: jasmine.createSpy('load').and.returnValue(Observable.of({}))
      };
      mockActiveCollection = { load: jasmine.createSpy('load').and.returnValue(Observable.of({})) };
      mockCollectionContext = { resetCollectionOptions: jasmine.createSpy('resetCollectionOptions') };
      componentUnderTest = new CollectionFormComponent(mockCollections, mockActiveCollection, null, null, mockCollectionContext);
      componentUnderTest.dialog = { close: () => { } };
    });

    describe('createCollection()', () => {
      it('Should create a new collection', () => {
        spyOn(componentUnderTest, 'loadCollections');
        componentUnderTest.createCollection(mockCollection());
        let collectionWithParsedTags = mockCollection();
        collectionWithParsedTags.tags = ['cat', 'dog', 'cow'];
        expect(componentUnderTest.loadCollections).toHaveBeenCalled();
        expect(componentUnderTest.collections.create).toHaveBeenCalledWith(collectionWithParsedTags);
        expect(componentUnderTest.activeCollection.load).toHaveBeenCalled();
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


