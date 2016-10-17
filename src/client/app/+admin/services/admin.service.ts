import {
  AdminState,
  AdminResponse,
  AdminUrlParams,
  AdminFormParams,
  Account
} from '../../shared/interfaces/admin.interface';
import { User } from '../../shared/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

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
export class AdminService {
  public data: Observable<AdminState>;
  constructor(public api: ApiService,
    private store: Store<AdminState>) {
    this.data = this.store.select('adminResources');
  }

  public setResources(data: AdminResponse): void {
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

  public getResourceIndex(queryObject: AdminUrlParams, resourceType: string): Observable<AdminResponse> {
    let params = Object.create(JSON.parse(JSON.stringify(queryObject)));
    params['i'] = (parseFloat(params['i']) - 1).toString();

    return this.api.get(Api.Identities, `${resourceType}/searchFields`, { parameters: params })
      .do(response => this.setResources(response));
  }

  public postResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    return this.api.post(Api.Identities, resourceType, { body: formData });
  }

  public putResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    return this.api.put(Api.Identities, `${resourceType}/${formData.id}`, { body: formData });
  }

  public buildSearchTerm(filterParams: AdminFormParams): AdminFormParams {
    let params = this.sanitizeFormInput(filterParams);
    let rawFields = this.buildFields(params);
    let rawValues = this.buildValues(params);
    let fields = rawFields.filter(this.removeFields).join(',');
    let values = rawValues.filter(this.removeFields).join(',');
    return { fields, values };
  }

  public sanitizeFormInput(fields: any): AdminFormParams {
    for (var field in fields) {
      if (this.dateFieldIsEmpty(fields, field)) {
        let date = new Date();
        fields[field] = date.setDate(date.getDate()) * 1000;
      } else if (fields[field] === '') {
        delete fields[field];
      }
    }
    return fields;
  }

  public dateFieldIsEmpty(fields: any, field: string): boolean {
    return (field === 'createdOn' || field === 'lastUpdated') && fields[field] === '';
  }

  public buildFields(filterParams: any): Array<string> {
    let map: any = { 'before': 'LT', 'after': 'GT' };
    let fields: Array<string> = Object.keys(filterParams);
    return fields.reduce((prev, current, index) => {
      if (current === 'DATE') {
        prev.push(current + ':' + map[filterParams[current]] + ':' + fields[index + 1]);
      } else {
        prev.push(current);
      }
      return prev;
    }, []);
  }

  public buildValues(filterParams: any): Array<string> {
    return Object.keys(filterParams).reduce((prev, current) => {
      if (this.valueIsADate(current)) {
        let date = new Date(filterParams[current]);
        prev.push(encodeURI((date.getTime() / 1000).toString()));
      } else {
        prev.push(encodeURI(filterParams[current]));
      }
      return prev;
    }, []);
  }

  public valueIsADate(currentField: string): boolean {
    return ['createdOn', 'lastUpdated'].indexOf(currentField) > -1;
  }

  public removeFields(field: string): boolean {
    return ['createdOn', 'lastUpdated', 'before', 'after'].indexOf(field) === -1;
  }
}
