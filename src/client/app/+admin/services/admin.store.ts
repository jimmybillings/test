import { Injectable } from '@angular/core';
import { AdminState } from '../../shared/interfaces/admin.interface';
import { ActionReducer, Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

const adminState: AdminState = { items: [], pagination: {} };
export const adminResources: ActionReducer<AdminState> = (state = adminState, action: Action) => {
  switch (action.type) {
    case 'ADMIN_SERVICE.SET_RESOURCES':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class AdminStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<any> {
    return this.store.select('adminResources');
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe((data: any) => state = data);
    return state;
  }

  public set(data: any): void {
    this.store.dispatch({
      type: 'ADMIN_SERVICE.SET_RESOURCES', payload: {
        'items': data.items,
        'pagination': {
          'totalCount': data.totalCount,
          'currentPage': data.currentPage + 1,
          'hasNextPage': data.hasNextPage,
          'hasPreviousPage': data.hasPreviousPage,
          'numberOfPages': data.numberOfPages,
          'pageSize': data.pageSize
        }
      }
    });
  }
}
