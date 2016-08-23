import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActiveCollectionService} from './active-collection.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CollectionShowResolver {
  constructor(private activeCollection: ActiveCollectionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return Observable.forkJoin([this.activeCollection.getItems(route.params['id'], 50, route.params['i']), this.activeCollection.set(route.params['id'])]);
    // return this.activeCollection.getItems(route.params['id'], 50, route.params['i']).map((d) => {
    //   this.activeCollection.set(route.params['id']).take(1).subscribe();
    // });
  }
}
