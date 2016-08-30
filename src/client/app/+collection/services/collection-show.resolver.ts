import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActiveCollectionService} from './active-collection.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CollectionShowResolver {
  constructor(private activeCollection: ActiveCollectionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (Number(this.activeCollection.state.id) === Number(route.params['id'])) {
      return this.activeCollection.getItems(route.params['id'], {i: route.params['i'], n: route.params['n']});
    } else {
      return Observable.forkJoin([
        this.activeCollection.set(route.params['id'], false),
        this.activeCollection.getItems(route.params['id'], {i: route.params['i'], n: route.params['n']}, false)
      ]).map((data: any) => {
        this.activeCollection.updateActiveCollectionStore(data[0]);
        this.activeCollection.updateActiveCollectionAssets(data[1]);
      });
    }
  }
}
