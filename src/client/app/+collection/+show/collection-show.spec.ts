import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  Observable,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { CollectionShowComponent} from './collection-show.component';
import { ActiveCollectionService} from '../services/active-collection.service';

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

    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      CollectionShowComponent,
      { provide: ActiveCollectionService, useClass: MockActiveCollectionService }
    ]);

    it('Should create instance of Collection Component',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(CollectionShowComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof CollectionShowComponent).toBeTruthy();
        });
      }));

    it('Should navigate to a new collection with the given collection id',
      inject([CollectionShowComponent], (component: CollectionShowComponent) => {
       spyOn(component.router, 'navigate');
       component.showAsset({assetId: 2});
       expect(component.router.navigate).toHaveBeenCalledWith(['/asset', 2]);
      }));


    it('Should remove a given asset from a collection',
      inject([CollectionShowComponent], (component: CollectionShowComponent) => {
       spyOn(component.activeCollection, 'removeAsset').and.callThrough();
       component.removeFromCollection(params());
       expect(component.activeCollection.removeAsset).toHaveBeenCalledWith(1, 1, 'asdfhjkl');
      }));
  });
}

function params() : any {
  return {
    collection: {
      id: 1,
      assets: {
        items: [
          {assetId: 1, uuid: 'asdfhjkl'},
          {assetId: 2, uuid: 'ajkl'},
          {assetId: 3, uuid: 'asdfhj'}
        ]
      }
    },
    asset: {
      assetId: 1
    }
  };
}
