import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import * as AssetActions from '../actions/asset.actions';
import { AppStore } from '../../app.store';
import { FutureAssetService } from '../services/asset.service';
import { Asset, Pojo } from '../../shared/interfaces/common.interface';
import * as SubclipMarkersInterface from '../../shared/interfaces/subclip-markers';
import { Location } from '@angular/common';
import { Common } from '../../shared/utilities/common.functions';

@Injectable()
export class AssetEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(AssetActions.Load.Type)
    .switchMap((action: AssetActions.Load) => this.service.load(action.loadParameters))
    .map((asset: Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)));

  @Effect({ dispatch: false })
  public updateMarkersInUrl: Observable<Action> = this.actions.ofType(AssetActions.UpdateMarkersInUrl.Type)
    .do((action: AssetActions.UpdateMarkersInUrl) => {
      let updatedTimeStart: number = SubclipMarkersInterface.timeStartFrom(action.markers);
      let updatedTimeEnd: number = SubclipMarkersInterface.timeEndFrom(action.markers);
      if (updatedTimeEnd < 0) updatedTimeEnd = undefined;
      if (updatedTimeStart < 0) updatedTimeStart = undefined;
      this.navigateWithUpdatedMarkers(action.assetId, updatedTimeStart, updatedTimeEnd);
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: FutureAssetService,
    private router: Router,
    private location: Location) { }

  private navigateWithUpdatedMarkers(assetId: number, updatedTimeStart: number, updatedTimeEnd: number) {
    let params: Pojo = Common.urlStringToParamsObject(this.router.routerState.snapshot.url);
    params.timeStart = updatedTimeStart;
    params.timeEnd = updatedTimeEnd;
    this.location.go(`/asset/${assetId}${Common.urlParamsObjectToUrlStringParams(params)}`);
  }
}
