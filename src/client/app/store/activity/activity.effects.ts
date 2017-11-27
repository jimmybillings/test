import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { ActivityService } from './activity.service';
import * as ActivityActions from './activity.actions';

@Injectable()
export class ActivityEffects {
  @Effect({ dispatch: false })
  public record: Observable<Action> = this.actions.ofType(ActivityActions.Record.Type)
    .switchMap((action: ActivityActions.Record) => this.service.record(action.options)
      .map(() => this.store.create(factory => factory.activity.recordSuccess()))
    );

  constructor(private actions: Actions, private store: AppStore, private service: ActivityService) { }
}
