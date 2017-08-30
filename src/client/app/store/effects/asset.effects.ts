import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import * as AssetActions from '../actions/asset.actions';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import * as CartActions from '../actions/active-collection.actions';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../services/asset.service';
import { Asset, Pojo, AssetLoadParameters } from '../../shared/interfaces/common.interface';
import { Collection } from '../../shared/interfaces/collection.interface';
import { AssetLineItem } from '../../shared/interfaces/commerce.interface';
import * as SubclipMarkersInterface from '../../shared/interfaces/subclip-markers';
import { Location } from '@angular/common';
import { Common } from '../../shared/utilities/common.functions';

@Injectable()
export class AssetEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(AssetActions.Load.Type)
    .switchMap((action: AssetActions.Load) =>
      this.service.load(action.loadParameters)
        .map((asset: Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.asset.loadFailure(error))))
    );

  @Effect({ dispatch: false })
  public updateMarkersInUrl: Observable<Action> = this.actions.ofType(AssetActions.UpdateMarkersInUrl.Type)
    .do((action: AssetActions.UpdateMarkersInUrl) => {
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
    this.location.go(`/asset/${assetId}${Common.urlParamsObjectToUrlStringParams(params)}`);
  }
}
