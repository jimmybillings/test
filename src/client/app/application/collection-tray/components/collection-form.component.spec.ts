import {
  beforeEachProvidersArray,
  Observable,
  Injectable,
  inject,
  addProviders
} from '../../../imports/test.imports';

import { CollectionFormComponent } from './collection-form.component';
import { CollectionsService } from '../../../+collection/services/collections.service';
import { ActiveCollectionService } from '../../../+collection/services/active-collection.service';

export function main() {
  describe('Collection Form component', () => {
    @Injectable()
    class MockCollectionsService {
      public data: Observable<any>;
      constructor() {
        this.data = Observable.of(mockCollections());
      }
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
        return Observable.of({ id: 2 });
      }
      set() {
        return Observable.of({});
      }

      getItems() {
        return Observable.of({});
      }
    }

    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        CollectionFormComponent,
        { provide: CollectionsService, useClass: MockCollectionsService },
        { provide: ActiveCollectionService, useClass: MockActiveCollectionService }
      ]);
    });

    it('Should create a new collection',
      inject([CollectionFormComponent], (component: CollectionFormComponent) => {
        component.dialog = {};
        component.dialog.close = function() {return true;};
        spyOn(component.collectionsService, 'createCollection').and.callThrough();
        spyOn(component.activeCollection, 'set').and.callThrough();
        spyOn(component.activeCollection, 'getItems').and.callThrough();
        spyOn(component.uiState, 'loading').and.callThrough();
        spyOn(component, 'loadCollections');
        component.createCollection(mockCollection());
        let collectionWithParsedTags = mockCollection();
        collectionWithParsedTags.tags = ['cat', 'dog', 'cow'];
        expect(component.loadCollections).toHaveBeenCalled();
        expect(component.collectionsService.createCollection).toHaveBeenCalledWith(collectionWithParsedTags);
        expect(component.activeCollection.set).toHaveBeenCalledWith(mockCollection().id);
        expect(component.activeCollection.getItems).toHaveBeenCalledWith(mockCollection().id, {n: 50});
        expect(component.uiState.loading).toHaveBeenCalled();
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
    id: 1,
    siteName: 'core',
    name: 'james billings',
    owner: 'james.billings@wazeedigital.com',
    tags: 'cat, dog, cow'
  };
}

function mockCollections(): any {
  return { 'items': [{ 'id': 196, 'name': 'Taxi Cabs', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['cabs', 'taxi', 'france'], 'assetsCount': 24, 'createdOn': '2016-06-21T18:15:28Z', 'lastUpdated': '2016-07-15T00:07:08Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/758/012/758012_001_lt.jpg' } } }, { 'id': 197, 'name': 'Habour of Boats', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['cabs', 'taxi', 'france'], 'assetsCount': 30, 'createdOn': '2016-06-21T18:17:02Z', 'lastUpdated': '2016-07-22T20:30:10Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/943/327/943327_4336_lt.jpg' } } }, { 'id': 198, 'name': 'mountain lions', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['lion'], 'assetsCount': 6, 'createdOn': '2016-06-21T18:21:30Z', 'lastUpdated': '2016-06-27T22:22:12Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/447/194/3/4471943_164_lt.jpg' } } }, { 'id': 200, 'name': 'Bengal Tigers', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': [' India', 'tiger'], 'assetsCount': 8, 'createdOn': '2016-06-21T18:24:04Z', 'lastUpdated': '2016-07-12T21:22:08Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/1KQ/004/1KQ004_221_lt.jpg' } } }, { 'id': 201, 'name': 'Test for tags', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': [' India', 'tiger'], 'assetsCount': 0, 'createdOn': '2016-06-21T18:24:28Z', 'lastUpdated': '2016-06-21T18:24:28Z' }, { 'id': 207, 'name': 'Roman Summer', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['country', 'summer'], 'assetsCount': 0, 'createdOn': '2016-06-21T18:31:28Z', 'lastUpdated': '2016-07-22T21:20:05Z' }, { 'id': 208, 'name': 'Village in Camino', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['country', 'summer'], 'assetsCount': 0, 'createdOn': '2016-06-21T18:31:56Z', 'lastUpdated': '2016-07-22T21:20:30Z' }, { 'id': 209, 'name': 'NYC in the Summertime', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': [''], 'assetsCount': 34, 'createdOn': '2016-06-21T18:32:30Z', 'lastUpdated': '2016-07-19T22:45:56Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/942/EFU/8/942EFU8_075_lt.jpg' } } }, { 'id': 212, 'name': 'Indian Ocean', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['alaska', 'bears'], 'assetsCount': 0, 'createdOn': '2016-06-21T18:44:53Z', 'lastUpdated': '2016-06-21T18:44:53Z' }, { 'id': 213, 'name': 'Hammocks', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': [''], 'assetsCount': 18, 'createdOn': '2016-06-21T18:45:47Z', 'lastUpdated': '2016-07-19T23:36:40Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/303/008/303008_072_lt.jpg' } } }, { 'id': 245, 'name': 'Dolphins', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['blue', ' ocean'], 'assetsCount': 15, 'createdOn': '2016-06-21T22:03:29Z', 'lastUpdated': '2016-07-12T19:53:57Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/808/113/38/80811338_099_lt.jpg' } } }, { 'id': 251, 'name': 'Moose of Yellowstone', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['meese', 'wyoming'], 'assetsCount': 14, 'createdOn': '2016-06-21T22:42:10Z', 'lastUpdated': '2016-06-27T22:26:50Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/1KQ/002/1KQ002_016_lt.jpg' } } }, { 'id': 284, 'name': 'Norwegian Fishing', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['fish', 'fishing', 'norway', 'boats'], 'assetsCount': 44, 'createdOn': '2016-06-27T23:16:45Z', 'lastUpdated': '2016-07-20T14:54:26Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/943/327/943327_4346_lt.jpg' } } }, { 'id': 292, 'name': 'Bergen Norway', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 26, 'createdOn': '2016-06-28T19:53:52Z', 'lastUpdated': '2016-07-22T14:42:17Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/943/327/943327_4164_lt.jpg' } } }, { 'id': 293, 'name': 'Maui Hawaii', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 19, 'createdOn': '2016-06-28T19:54:58Z', 'lastUpdated': '2016-07-22T20:29:39Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/523/131/523131_054_lt.jpg' } } }, { 'id': 301, 'name': 'Machu Picchu', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['lama', 'peru'], 'assetsCount': 60, 'createdOn': '2016-06-30T20:02:17Z', 'lastUpdated': '2016-07-20T14:52:51Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/1KY/001/1KY001_090_lt.jpg' } } }, { 'id': 354, 'name': 'Tiger Woods Interviews', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['golf', 'woods', 'tiger', 'interviews'], 'assetsCount': 18, 'createdOn': '2016-07-19T23:12:07Z', 'lastUpdated': '2016-07-21T17:23:40Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/186/264/5/1862645_081_lt.jpg' } } }, { 'id': 510, 'name': 'Maui Hawaii +25', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 0, 'createdOn': '2016-07-27T19:34:59Z', 'lastUpdated': '2016-07-27T19:34:59Z' }, { 'id': 512, 'name': 'mo 115', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 0, 'createdOn': '2016-07-27T19:36:59Z', 'lastUpdated': '2016-07-27T19:36:59Z' }, { 'id': 518, 'name': 'mooze', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 0, 'createdOn': '2016-07-27T19:46:50Z', 'lastUpdated': '2016-07-27T19:46:50Z' }, { 'id': 527, 'name': 'mo 117 test', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['green', 'test', 'enter'], 'assetsCount': 0, 'createdOn': '2016-07-28T00:44:23Z', 'lastUpdated': '2016-07-28T00:44:23Z' }, { 'id': 528, 'name': 'Maui Hawaii five-o', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['tropical', 'cops'], 'assetsCount': 0, 'createdOn': '2016-07-28T00:46:03Z', 'lastUpdated': '2016-07-28T00:46:03Z' }, { 'id': 530, 'name': 'Machu Picchu2', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 0, 'createdOn': '2016-07-28T14:38:59Z', 'lastUpdated': '2016-07-28T14:38:59Z' }, { 'id': 531, 'name': 'Machu Picchu3', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 0, 'createdOn': '2016-07-28T18:16:18Z', 'lastUpdated': '2016-07-28T18:16:18Z' }, { 'id': 532, 'name': 'Machu Picchu4', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 0, 'createdOn': '2016-07-28T18:19:19Z', 'lastUpdated': '2016-07-28T18:19:19Z' }, { 'id': 535, 'name': 'most interesting', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'assetsCount': 0, 'createdOn': '2016-07-28T18:42:41Z', 'lastUpdated': '2016-07-28T18:42:41Z' }, { 'id': 536, 'name': 'I want a new collection', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['now', 'please'], 'assetsCount': 0, 'createdOn': '2016-07-28T19:38:19Z', 'lastUpdated': '2016-07-28T19:38:19Z' }, { 'id': 537, 'name': 'Maui Hawaii five-99', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['tag1', 'tag2'], 'assetsCount': 15, 'createdOn': '2016-07-28T19:47:50Z', 'lastUpdated': '2016-07-29T16:30:58Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/161/918/2/1619182_073_lt.jpg' } } }, { 'id': 538, 'name': 'Maui Hawaii testing', 'owner': 62, 'email': 'jeff+2@jeffhyde.com', 'userRole': 'owner', 'tags': ['here', 'tag'], 'assetsCount': 0, 'createdOn': '2016-07-28T21:40:04Z', 'lastUpdated': '2016-07-28T21:40:04Z' }, { 'id': 136, 'name': 'Alternative Energy', 'owner': 5, 'email': 'jeff@jeffhyde.com', 'userRole': 'editor', 'editors': [50, 62], 'tags': ['solar', 'wind', 'DC'], 'assetsCount': 6, 'createdOn': '2016-06-14T00:59:33Z', 'lastUpdated': '2016-07-29T18:47:54Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/943/327/943327_1985_lt.jpg' } } }, { 'id': 174, 'name': 'Sheep herders Throughout the Middle East', 'owner': 5, 'email': 'jeff@jeffhyde.com', 'userRole': 'viewer', 'editors': [50], 'tags': ['sheep'], 'assetsCount': 14, 'createdOn': '2016-06-20T22:51:30Z', 'lastUpdated': '2016-07-21T18:18:03Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/1HF/006/1HF006_160_lt.jpg' } } }, { 'id': 103, 'name': 'Tropical Forests', 'owner': 5, 'email': 'jeff@jeffhyde.com', 'userRole': 'viewer', 'tags': ['palm trees'], 'assetsCount': 19, 'createdOn': '2016-06-08T23:24:44Z', 'lastUpdated': '2016-06-28T19:20:03Z', 'collectionThumbnail': { 'name': 'thumbnail', 'urls': { 'https': 'https://cdnt3m-a.akamaihd.net/tem/warehouse/943/301/943301_0153_lt.jpg' } } }], 'pagination': { 'totalCount': 40, 'currentPage': 1, 'hasNextPage': false, 'hasPreviousPage': false, 'numberOfPages': 1, 'pageSize': 200 } };
}

// function mockKeyboardEventDownArrow(): any {
//   return { 'keyCode': 40 };
// }
