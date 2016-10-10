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
export class AppEventEmitter {
  private eventsSubject: Subject<any>;

  constructor() {
    this.eventsSubject = new Subject();
  }

  public emit(event: AppEvent) {
    this.events.next(event);
  }

  public get events():Subject<any> {
    return this.eventsSubject;
  }
}

