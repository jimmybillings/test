import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AssetService } from '../../shared/services/asset.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CurrentUserService } from '../../shared/services/current-user.service';

@Injectable()
export class AssetResolver {
  constructor(private asset: AssetService, private currentUser: CurrentUserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.asset.getData({
      assetId: route.params['name'],
      share_key: route.params['share_key'],
      uuid: route.params['uuid'],
      timeEnd: route.params['timeEnd'],
      timeStart: route.params['timeStart']
    });
  }
}
