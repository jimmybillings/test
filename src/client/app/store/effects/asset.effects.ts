import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as AssetActions from '../actions/asset.actions';
import { AppStore } from '../../app.store';
import { FutureAssetService } from '../services/asset.service';
import { Asset } from '../../shared/interfaces/common.interface';

@Injectable()
export class AssetEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(AssetActions.Load.Type)
    .switchMap((action: AssetActions.Load) => this.service.load(action.loadParameters))
    .map((asset: Asset) => this.store.create(factory => factory.asset.loadSuccess(asset)));

  constructor(private actions: Actions, private store: AppStore, private service: FutureAssetService) { }
}
