import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActiveCollectionService} from './active-collection.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CollectionShowResolver {
  constructor(private activeCollection: ActiveCollectionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (parseInt(this.activeCollection.state.id) === parseInt(route.params['id'])) {
      return this.activeCollection.getItems(route.params['id'], {n: 50, i: route.params['i']});
    } else {
      return Observable.forkJoin([
        this.activeCollection.set(route.params['id']),
        this.activeCollection.getItems(route.params['id'], {n: 50, i: route.params['i']})
      ]);
    }
  }
}
