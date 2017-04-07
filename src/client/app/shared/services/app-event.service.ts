import { Subject } from 'rxjs/Subject';

export interface AppEvent {
  type: AppEventType;
  payload?: any;
}

export const enum AppEventType {
  HomePageSearch,
  UserLogOut
}

export class AppEventService {
  public static eventsSubject: Subject<any> = new Subject();

  public static emit(event: AppEvent) {
    AppEventService.eventsSubject.next(event);
  }

  public static get events(): Subject<AppEvent> {
    return AppEventService.eventsSubject;
  }
}

