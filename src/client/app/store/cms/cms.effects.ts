import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { CmsService } from './cms.service';
import * as CmsActions from './cms.actions';

@Injectable()
export class CmsEffects {
  @Effect()
  public loadFooter: Observable<Action> = this.actions.ofType(CmsActions.LoadFooter.Type)
    .switchMap((action: CmsActions.LoadFooter) =>
      this.service.loadFooter()
        .map((footer: any) => this.store.create(factory => factory.cms.loadFooterSuccess(footer)))
        .catch(error => Observable.of(this.store.create(factory => factory.error.handle(error))))
    );

  @Effect()
  public loadHomeAssets: Observable<Action> = this.actions.ofType(CmsActions.LoadHomeAssets.Type)
    .switchMap((action: CmsActions.LoadHomeAssets) =>
      this.service.loadHomeAssets()
        .map((homeAssets: any) => this.store.create(factory => factory.cms.loadHomeAssetsSuccess(homeAssets)))
        .catch(error => Observable.of(this.store.create(factory => factory.error.handle(error))))
    );

  constructor(private actions: Actions, private store: AppStore, private service: CmsService) { }



}
