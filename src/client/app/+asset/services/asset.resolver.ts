import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetService } from './asset.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AssetResolver {
  constructor(private asset: AssetService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.asset.getPrice(route.params['name']).subscribe();
    return this.asset.getData(route.params['name']);
  }
}
