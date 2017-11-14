import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { SharingService } from './sharing.service';
import * as SharingActions from './sharing.actions';

@Injectable()
export class SharingEffects {
  @Effect()
  createAssetShareLink: Observable<Action> = this.actions.ofType(SharingActions.CreateAssetShareLink.Type)
    .switchMap((action: SharingActions.CreateAssetShareLink) =>
      this.service.createAssetShareLink(action.assetId, action.subclipMarkers)
        .map(link => this.store.create(factory => factory.sharing.createAssetShareLinkSuccess(link)))
        .catch(error => Observable.of(this.store.create(factory => factory.error.handle(error))))
    );

  @Effect()
  emailAssetShareLink: Observable<Action> = this.actions.ofType(SharingActions.EmailAssetShareLink.Type)
    .switchMap((action: SharingActions.EmailAssetShareLink) =>
      this.service.emailAssetShareLink(action.assetId, action.subclipMarkers, action.parameters)
        .map(() => this.store.create(factory => factory.snackbar.display('ASSET.SHARING.SHARED_CONFIRMED_MESSAGE')))
        .catch(error => Observable.of(this.store.create(factory => factory.error.handle(error))))
    );

  constructor(private actions: Actions, private store: AppStore, private service: SharingService) { }
}
