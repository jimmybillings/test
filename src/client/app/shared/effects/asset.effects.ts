import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as AssetActions from '../actions/asset.actions';
import { FutureAssetService } from '../future_services/asset.service';
import { Asset } from '../interfaces/common.interface';

@Injectable()
export class AssetEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(AssetActions.LOAD)
    .switchMap((action: AssetActions.Load) => this.service.load(action.payload))
    .map((asset: Asset) => new AssetActions.LoadSuccess(asset));

  constructor(private actions: Actions, private service: FutureAssetService) { }
}
