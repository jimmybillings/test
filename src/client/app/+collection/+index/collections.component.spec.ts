import {
  beforeEachProvidersArray,
  Observable,
  inject,
  TestBed
} from '../../imports/test.imports';

import { CollectionsComponent } from './collections.component';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
import { CollectionsService } from '../../shared/services/collections.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { MdDialog } from '@angular/material';

export function main() {
  describe('Collection Component', () => {
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
      isActiveCollection() {
        return Observable.of({});
      }
      getItems() {
        return Observable.of({});
      }
    }

    class MockCollectionsService {
      public data: Observable<any>;
      public state: any;
      constructor() {
        this.state = { items: [{ id: 1 }] };
        this.data = Observable.of({ items: [1, 2, 3, 4, 5] });
      }
      delete() {
        return Observable.of({});
      }
    }

    class MockMdSnackBar {
      open() {
        return true;
      }
    }

    class MockTranslateService {
      get() {
        return Observable.of({});
      }
    }

    class MockMdDialog {
      open() {
        return true;
      }
    }

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        CollectionsComponent,
        { provide: ActiveCollectionService, useClass: MockActiveCollectionService },
        { provide: CollectionsService, useClass: MockCollectionsService },
        { provide: MdSnackBar, useClass: MockMdSnackBar },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: MdDialog, useClass: MockMdDialog }

      ]
    }));

    it('Should set a new active collection',
      inject([CollectionsComponent], (component: CollectionsComponent) => {
        component.pageSize = '50';
        spyOn(component.activeCollection, 'load').and.callThrough();;
        component.selectActiveCollection(1);
        expect(component.activeCollection.load).toHaveBeenCalledWith(1);
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

    // it('Should delete a collection, if its the active collection it should default to another',
    //   inject([CollectionsComponent], (component: CollectionsComponent) => {
    //     component.pageSize = '50';
    //     spyOn(component.collections, 'delete').and.callThrough();
    //     spyOn(component.activeCollection, 'load').and.callThrough();
    //     component.deleteCollection(1);
    //     expect(component.collections.delete).toHaveBeenCalledWith(1);
    //     expect(component.activeCollection.load).toHaveBeenCalled();
    //   }));
  });
}
