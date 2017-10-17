import { WzCollectionItemListComponent } from './wz.collection-item-list.component';
import { Collection } from '../../shared/interfaces/collection.interface';

export function main() {
  describe('Wz Collection Item List Component', () => {
    let componentUnderTest: WzCollectionItemListComponent;

    beforeEach(() => {
      componentUnderTest = new WzCollectionItemListComponent();
      componentUnderTest.currentCollection = mockCurrentCollection();
    });

    describe('selectActiveCollection()', () => {
      it('emits setActiveCollection with a collection id', () => {
        spyOn(componentUnderTest.setActiveCollection, 'emit');
        componentUnderTest.selectActiveCollection(123);

        expect(componentUnderTest.setActiveCollection.emit).toHaveBeenCalledWith(123);
      });
    });

    describe('setCurrentCollection()', () => {
      it('takes a collection and sets the currentCollection var to it', () => {
        componentUnderTest.setCurrentCollection(mockCollection());

        expect(componentUnderTest.currentCollection).toEqual(mockCollection());
      });
    });

    describe('collectionIsShared()', () => {
      it('should return true when collection has editors or viewers', () => {

        expect(componentUnderTest.collectionIsShared(mockCollection())).toBe(true);
      });
      it('should return false when collection does not have editors or viewers', () => {

        expect(componentUnderTest.collectionIsShared(mockCollectionNotShared())).toBe(false);
      });
    });

    describe('edit()', () => {
      it('emits editCollection with a collection', () => {
        spyOn(componentUnderTest.editCollection, 'emit');
        componentUnderTest.edit(mockCollection());

        expect(componentUnderTest.editCollection.emit).toHaveBeenCalledWith(mockCollection());
      });
    });

    describe('sharedMembers()', () => {
      it('emits showShareMembers with a collection', () => {
        spyOn(componentUnderTest.showShareMembers, 'emit');
        componentUnderTest.sharedMembers(mockCollection());

        expect(componentUnderTest.showShareMembers.emit).toHaveBeenCalledWith(mockCollection());
      });
    });

    describe('delete()', () => {
      it('emits deleteCollection with a collection', () => {
        spyOn(componentUnderTest.deleteCollection, 'emit');
        componentUnderTest.delete(mockCollection());

        expect(componentUnderTest.deleteCollection.emit).toHaveBeenCalledWith(mockCollection());
      });
    });

    describe('duplicate()', () => {
      it('emits duplicateCollection with the current collection id', () => {
        spyOn(componentUnderTest.duplicateCollection, 'emit');
        componentUnderTest.duplicate();

        expect(componentUnderTest.duplicateCollection.emit).toHaveBeenCalledWith(3);
      });
    });

    describe('generateLegacyLink()', () => {
      it('emits generateCollectionLink with the current collection id', () => {
        spyOn(componentUnderTest.generateCollectionLink, 'emit');
        componentUnderTest.generateLegacyLink();

        expect(componentUnderTest.generateCollectionLink.emit).toHaveBeenCalledWith(3);
      });
    });
  });
};

function mockCollection(): Collection {
  return {
    id: 2,
    siteName: 'core',
    name: 'james billings',
    createdOn: new Date('2017-10-17T19:20:25.083Z'),
    owner: 123,
    tags: 'cat, dog, cow',
    userRole: 'owner',
    editors: [1, 2, 300],
    viewers: [4]
  };
}
function mockCurrentCollection(): Collection {
  return {
    id: 3,
    siteName: 'core',
    name: 'Jane Doe',
    createdOn: new Date('2017-10-12T14:20:25.083Z'),
    owner: 333,
    tags: 'frog, lizard, snake',
    userRole: 'owner',
    editors: [6, 7, 800],
    viewers: [5]
  };
}
function mockCollectionNotShared(): Collection {
  return {
    id: 4,
    siteName: 'core',
    name: 'Bob Dole',
    createdOn: new Date('2017-07-12T14:20:25.083Z'),
    owner: 7676,
    tags: 'suit, tie, pants',
    userRole: 'owner'
  };
}
