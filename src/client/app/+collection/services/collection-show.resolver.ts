import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CollectionShowResolver {
  constructor(private activeCollection: ActiveCollectionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (Number(this.activeCollection.state.id) === Number(route.params['id'])) {
      return this.activeCollection.getItems(route.params['id'], { i: route.params['i'], n: route.params['n'] });
    } else {
      return this.activeCollection.load(route.params['id'], { i: route.params['i'], n: route.params['n'] });
    }
  }
}
