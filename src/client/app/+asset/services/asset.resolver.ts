import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetService} from './asset.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AssetResolver {
  constructor(private asset: AssetService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return Observable.forkJoin([
      // this.asset.initialize(route.params['name']),
      this.asset.getData(route.params['name']),
      this.asset.getPrice(route.params['name'])
      // ]);
    ]).map((data: any) => {
      this.asset.setActiveAsset(data[0], data[1]);
    });
    // return this.asset.initialize(route.params['name']);
  }
}
