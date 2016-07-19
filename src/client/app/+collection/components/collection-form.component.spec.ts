import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  Observable,
  Injectable,
  describe,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { CollectionFormComponent } from './collection-form.component';
import { CollectionsService } from '../services/collections.service';

export function main() {
  describe('Collection Form component', () => {

    @Injectable()
    class MockCollectionsService {
      public createCollection(collection: any): Observable<any> {
        return Observable.of(collection);
      }
      public createCollectionInStore(collection: any): any {
        return true;
      }
      public updateFocusedCollection(collection: any): any {
        return true;
      }
    }

    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      CollectionFormComponent,
      { provide: CollectionsService, useClass: MockCollectionsService }
    ]);

    it('Create instance of collection form',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(CollectionFormComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof CollectionFormComponent).toBeTruthy();
        });
      }));
  });
}
