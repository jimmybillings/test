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

    .switchMap((action: SpeedPreviewActions.Load) => {
      return this.service.load(action.asset);
    })

    .map((speedPreviewData: SpeedviewData) => {
      return this.store.create(factory => factory.speedPreview.loadSuccess(speedPreviewData));
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: SpeedPreviewService
  ) { }
}
