import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { HelpRequestService } from './help-request.service';

@Injectable()
export class HelpRequestEffects {
  constructor(private actions: Actions, private store: AppStore, private service: HelpRequestService) { }
}
