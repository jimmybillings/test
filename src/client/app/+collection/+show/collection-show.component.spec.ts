import {
  beforeEachProvidersArray,
  Observable,
  inject,
  TestBed
} from '../../imports/test.imports';

import { CollectionShowComponent } from './collection-show.component';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';

export function main() {
  describe('Collection Show Component', () => {
    class MockActiveCollectionService {
      public data: Observable<any>;
      constructor() {
        this.data = Observable.of({ id: 1 });
      }

      removeAsset(one: any, two: any, three: any) {
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

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        CollectionShowComponent,
        { provide: ActiveCollectionService, useClass: MockActiveCollectionService },
        { provide: MdSnackBar, useClass: MockMdSnackBar },
        { provide: TranslateService, useClass: MockTranslateService },
      ]
    }));

    it('Should remove a given asset from a collection',
      inject([CollectionShowComponent], (component: CollectionShowComponent) => {
        spyOn(component.activeCollection, 'removeAsset').and.callThrough();
        component.removeFromCollection(params());
        expect(component.activeCollection.removeAsset).toHaveBeenCalledWith(params());
      }));
  });
}


function params(): any {
  return {
    collection: {
      id: 1,
      assets: {
        items: [
          { assetId: 1, uuid: 'asdfhjkl' },
          { assetId: 2, uuid: 'ajkl' },
          { assetId: 3, uuid: 'asdfhj' }
        ]
      }
    },
    asset: {
      assetId: 1
    }
  };
}
