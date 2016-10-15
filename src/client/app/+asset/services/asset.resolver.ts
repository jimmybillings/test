import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetService } from '../../shared/services/asset.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class AssetResolver {
  constructor(private asset: AssetService, private currentUser:CurrentUser) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (this.currentUser.loggedIn()) this.asset.getPrice(route.params['name']).subscribe();
    if (route.params['share_key']) {
      return this.asset.getData(route.params['name'], route.params['share_key']);
    } else {
      return this.asset.getData(route.params['name']);
    }
  }
}
