import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as SpeedPreviewActions from '../actions/speed-preview.actions';
import { AppStore } from '../../app.store';
import { SpeedPreviewService } from '../services/speed-preview.service';
import { SpeedviewData } from '../../shared/interfaces/asset.interface';
import { State } from '../states/speed-preview.state';

@Injectable()
export class SpeedPreviewEffects {

  @Effect()
  public load: Observable<Action> = this.actions.ofType(SpeedPreviewActions.Load.Type)

    .filter((action: SpeedPreviewActions.Load) =>
      !this.store.snapshot(state => state.speedPreview[action.asset.assetId]))

    .switchMap((action: SpeedPreviewActions.Load) =>
      this.service.load(action.asset))

    .map((speedPreviewData: SpeedviewData) =>
      this.store.create(factory => factory.speedPreview.loadSuccess(speedPreviewData)));

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: SpeedPreviewService
  ) { }
}
