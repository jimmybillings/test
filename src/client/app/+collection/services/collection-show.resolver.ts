import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActiveCollectionService} from './active-collection.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CollectionShowResolver {
  constructor(private activeCollection: ActiveCollectionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<any> {
    return this.activeCollection.set(route.params['id']).map(collection => {
      return this.activeCollection.getItems(collection.id, 300).take(1).subscribe();
    });
  }
}
