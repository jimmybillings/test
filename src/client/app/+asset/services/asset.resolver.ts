import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import * as AssetActions from '../../shared/actions/asset.actions';
import { State } from '../../app.store';
import { AssetLoadParameters } from '../../shared/interfaces/common.interface';

@Injectable()
export class AssetResolver implements Resolve<boolean> {
  constructor(private store: Store<State>) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.store.dispatch(new AssetActions.Load(this.convertToLoadParameters(route.params)));

    return this.store.select(state => state.asset.loaded).filter(loaded => loaded).take(1);
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
