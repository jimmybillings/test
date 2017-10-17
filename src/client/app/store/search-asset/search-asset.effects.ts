import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import * as SearchAssetActions from './search-asset.actions';
import * as SubclipMarkersInterface from '../../shared/interfaces/subclip-markers';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../asset/asset.service';
import { Asset, Pojo } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

@Injectable()
export class SearchAssetEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(SearchAssetActions.Load.Type)
    .switchMap((action: SearchAssetActions.Load) =>
      this.service.load(action.loadParameters)
        .map((asset: Asset) => this.store.create(factory => factory.searchAsset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.searchAsset.loadFailure(error))))
    );

  @Effect({ dispatch: false })
  public updateMarkersInUrl: Observable<Action> = this.actions.ofType(SearchAssetActions.UpdateMarkersInUrl.Type)
    .do((action: SearchAssetActions.UpdateMarkersInUrl) => {
      const duration: SubclipMarkersInterface.Duration = SubclipMarkersInterface.durationFrom(action.markers);
      let updatedTimeStart: number = duration.timeStart;
      let updatedTimeEnd: number = duration.timeEnd;
      if (updatedTimeEnd < 0) updatedTimeEnd = undefined;
      if (updatedTimeStart < 0) updatedTimeStart = undefined;
      this.navigateWithUpdatedMarkers(action.assetId, updatedTimeStart, updatedTimeEnd);
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: AssetService,
    private router: Router,
    private location: Location) { }

  private navigateWithUpdatedMarkers(assetId: number, updatedTimeStart: number, updatedTimeEnd: number) {
    let params: Pojo = Common.urlStringToParamsObject(this.router.routerState.snapshot.url);
    params.timeStart = updatedTimeStart;
    params.timeEnd = updatedTimeEnd;
    this.location.go(`/search/asset/${assetId}${Common.urlParamsObjectToUrlStringParams(params)}`);
  }
}
