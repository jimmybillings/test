import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

export interface AppEvent {
  type: AppEventType;
  payload?: any;
}

export const enum AppEventType {
  HomePageSearch
}

@Injectable()
export class AppEventService {
  private eventsSubject: Subject<any> = new Subject();

  public emit(event: AppEvent) {
    this.events.next(event);
  }

  public get events(): Subject<AppEvent> {
    return this.eventsSubject;
  }
}

