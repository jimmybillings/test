import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActiveCollectionService} from './active-collection.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CollectionShowResolver {
  constructor(private activeCollection: ActiveCollectionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<any> {
    this.activeCollection.set(route.params['id']).take(1).subscribe();
    return this.activeCollection.getItems(route.params['id'], 300);
    // });
  }
}
