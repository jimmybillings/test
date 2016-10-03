import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetService } from './asset.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';

@Injectable()
export class AssetResolver {
  constructor(private asset: AssetService, private currentUser:CurrentUser) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (this.currentUser.loggedIn()) this.asset.getPrice(route.params['name']).subscribe();
    return this.asset.getData(route.params['name']);
  }
}
