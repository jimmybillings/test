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

@Injectable()
export class AssetEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(AssetActions.Load.Type)
    .switchMap((action: AssetActions.Load) => this.service.load(action.loadParameters))
    .map((asset: Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)));

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
    private service: FutureAssetService,
    private router: Router,
    private location: Location) { }

  private navigateWithUpdatedMarkers(assetId: number, updatedTimeStart: number, updatedTimeEnd: number) {
    let params: Pojo = this.urlStringToParamsObject(this.router.routerState.snapshot.url);
    params.timeStart = updatedTimeStart;
    params.timeEnd = updatedTimeEnd;
    this.location.go(`/asset/${assetId}${this.urlParamsObjectToUrlStringParams(params)}`);
  }

  private urlStringToParamsObject(url: string): Pojo {
    var hashes: string | string[] = url.split(/;(.+)/)[1];
    hashes = (hashes) ? hashes.split(';') : [];
    return hashes.reduce((urlObj: Pojo, hash: string) => {
      let param: string[] = hash.split('=');
      urlObj[param[0]] = param[1];
      return urlObj;
    }, {});
  }

  private urlParamsObjectToUrlStringParams(urlObj: Pojo): string {
    let paramString: string = ';';
    Object.keys(urlObj).forEach((param) => {
      paramString = paramString + param + '=' + urlObj[param] + ';';
    });
    paramString = paramString.slice(0, -1);
    return paramString;
  }
}
