import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { AppStore } from '../../app.store';
import { AssetLoadParameters } from '../../shared/interfaces/common.interface';

@Injectable()
export class SearchAssetResolver implements Resolve<boolean> {
  constructor(private store: AppStore) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.store.dispatch(factory => factory.asset.load(this.convertToLoadParameters(route.params)));

    return this.store.blockUntil(state => state.asset.loaded);
  }

  private convertToLoadParameters(routeParameters: { [key: string]: any }): AssetLoadParameters {
    return {
      id: routeParameters['id'],
      share_key: routeParameters['share_key'],
      uuid: routeParameters['uuid'],
      timeEnd: routeParameters['timeEnd'],
      timeStart: routeParameters['timeStart']
    };
  }
}
