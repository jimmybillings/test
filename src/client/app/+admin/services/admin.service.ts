import {
  AdminState,
  AdminResponse,
  AdminUrlParams,
  AdminFormParams,
  Account
} from '../../shared/interfaces/admin.interface';
import { User } from '../../shared/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Store, ActionReducer, Action} from '@ngrx/store';
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
export class AdminService {
  public data: Observable<AdminState>;
  constructor(public http: Http,
              public apiConfig: ApiConfig,
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

  public getResourceIndex(queryObject: AdminUrlParams, resource: string): Observable<AdminResponse> {
    let params = Object.create(JSON.parse(JSON.stringify(queryObject)));
    params['i'] = (parseFloat(params['i']) - 1).toString();
    let url = this.buildUrl('search', resource);
    let options = this.getIdentitiesSearchOptions(params);
    return this.http.get(url, options).map((res: Response) => {
      this.setResources(res.json());
      return res.json();
    });
  }

  public postResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    let url = this.buildUrl('post', resourceType);
    let options = this.buildRequestOptions();
    let body = JSON.stringify(formData);
    return this.http.post(url, body, options).map((res: Response) => res.json());
  }

  public putResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    let url = this.buildUrl('put', resourceType, formData.id);
    let options = this.buildRequestOptions();
    let body = JSON.stringify(formData);
    return this.http.put(url, body, options).map((res: Response) => res.json());
  }

  public getIdentitiesSearchOptions(queryObject: AdminFormParams): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    let options = this.buildRequestOptions(search);
    return new RequestOptions(options);
  }

  public buildRequestOptions(search?: URLSearchParams): RequestOptions {
    let headers = this.apiConfig.authHeaders();

    return search ? new RequestOptions({ headers, search, body: '' }) : new RequestOptions({ headers, body: '' });
  }

  public buildUrl(type: string, resourceType: string, resourceId?: number): string {
    let base = this.apiConfig.baseUrl();
    switch (type) {
      case 'put':
        return `${base}api/identities/v1/${resourceType}/${resourceId}`;
      case 'post':
        return `${base}api/identities/v1/${resourceType}`;
      case 'search':
        return `${base}api/identities/v1/${resourceType}/searchFields/?`;
      default:
        return `${base}api/identities/v1/${resourceType}/searchFields/?`;
    }
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
    let map: any = {'before': 'LT','after': 'GT'};
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
