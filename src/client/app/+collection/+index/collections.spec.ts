import {
  beforeEachProvidersArray,
  Observable,
  inject,
  TestBed
} from '../../imports/test.imports';

import { CollectionsComponent} from './collections.component';
import { ActiveCollectionService} from '../../shared/services/active-collection.service';
import { CollectionsService} from '../../shared/services/collections.service';

export function main() {
  describe('Collection Component', () => {
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
      isActiveCollection() {
        return Observable.of({});
      }
      getItems() {
        return Observable.of({});
      }
    }

    class MockCollectionsService {
      public data: Observable<any>;
      constructor() {
        this.data = Observable.of({items: [1, 2, 3, 4, 5]});
      }
      deleteCollection() {
        return Observable.of({});
      }
    }

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        CollectionsComponent,
        { provide: ActiveCollectionService, useClass: MockActiveCollectionService },
        { provide: CollectionsService, useClass: MockCollectionsService },
      ]
    }));

    it('Should set a new active collection',
      inject([CollectionsComponent], (component: CollectionsComponent) => {
        component.pageSize = '50';
        spyOn(component.activeCollection, 'set').and.callThrough();;
        spyOn(component.activeCollection, 'getItems').and.callThrough();;
        component.selectActiveCollection(1);
        expect(component.activeCollection.set).toHaveBeenCalledWith(1);
        expect(component.activeCollection.getItems).toHaveBeenCalledWith(1, {n: '50'});
      }));

    // it('Should return the thumbnail in the collection',
    //   inject([CollectionsComponent], (component: CollectionsComponent) => {
    //     let thumbnail: any = {};
    //     thumbnail.urls = {};
    //     thumbnail.urls.https = 'http://customimage.com/picture.jpg';
    //     expect(component.thumbnail(thumbnail)).toEqual('http://customimage.com/picture.jpg');
    //   }));

    // it('Should return the missing thumbnail image if no image was found',
    //   inject([CollectionsComponent], (component: CollectionsComponent) => {
    //     let thumbnail: any = {};
    //     expect(component.thumbnail(thumbnail.url)).toEqual('/assets/img/tbn_missing.jpg');
    //   }));

    it('Should delete a collection, if its the active collection it should default to another',
      inject([CollectionsComponent], (component: CollectionsComponent) => {
        component.pageSize = '50';
        spyOn(component.collectionsService, 'deleteCollection').and.callThrough();
        spyOn(component.activeCollection, 'get').and.callThrough();
        spyOn(component.activeCollection, 'getItems').and.callThrough();
        component.deleteCollection(1);
        expect(component.collectionsService.deleteCollection).toHaveBeenCalledWith(1);
        expect(component.activeCollection.get).toHaveBeenCalled();
        expect(component.activeCollection.getItems).toHaveBeenCalledWith(2, {n: '50'});
      }));
  });
}
