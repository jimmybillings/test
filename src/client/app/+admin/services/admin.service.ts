import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

const adminState: any = { items: [], pagination: {} };
export const adminResources: Reducer<any> = (state = adminState, action: Action) => {
  switch (action.type) {
    case 'ADMIN_SERVICE.SET_RESOURCES':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class AdminService {
  public adminStore: Observable<any>;
  constructor(public http: Http,
              public apiConfig: ApiConfig,
              private store: Store<any>) {
    this.adminStore = this.store.select('adminResources');
  }

    public setResources(data: any): void {
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

  public getResourceIndex(queryObject: any, resource: string): Observable<any> {
    queryObject['i'] = (parseFloat(queryObject['i']) - 1).toString();
    let url = this.buildUrl('search', resource);
    let options = this.getIdentitiesSearchOptions(queryObject);
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  public postResource(resourceType: string, formData: any): Observable<any> {
    let url = this.buildUrl('post', resourceType);
    let options = this.buildRequestOptions();
    let body = JSON.stringify(formData);
    return this.http.post(url, body, options).map((res: Response) => res.json());
  }

  public putResource(resourceType: string, formData: any): Observable<any> {
    let url = this.buildUrl('put', resourceType, formData.id);
    let options = this.buildRequestOptions();
    let body = JSON.stringify(formData);
    return this.http.put(url, body, options).map((res: Response) => res.json());
  }

  public getIdentitiesSearchOptions(queryObject: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    let options = this.buildRequestOptions(search);
    return new RequestOptions(options);
  }

  public buildRequestOptions(search?: URLSearchParams): RequestOptions {
    let headers = this.apiConfig.authHeaders();
    return search ? new RequestOptions({ headers, search }) : new RequestOptions({ headers });
  }

  public buildUrl(type: string, resourceType: string, resourceId?: string): string {
    let base = this.apiConfig.baseUrl();
    switch (type) {
      case 'put':
        return `${base}api/identities/v1/${resourceType}/${resourceId}`;
      case 'post':
        return `${base}api/identities/v1/${resourceType}`;
      case 'search':
        return `${base}api/identities/v1/${resourceType}/searchFields/?`;
      default:
        return;
    }
  }

  public buildSearchTerm(filterParams: any): any {
    let params = this.sanitizeFormInput(filterParams);
    let rawFields = this.buildFields(params);
    let rawValues = this.buildValues(params);
    let fields = rawFields.filter(this.removeFields).join(',');
    let values = rawValues.filter(this.removeFields).join(',');
    return { fields, values };
  }

  public sanitizeFormInput(fields: any): any {
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

  public dateFieldIsEmpty(fields: any, field: any): boolean {
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

  public valueIsADate(currentField: any): any {
    return ['createdOn', 'lastUpdated'].indexOf(currentField) > -1;
  }

  public removeFields(field: string): boolean {
    return ['createdOn', 'lastUpdated', 'before', 'after'].indexOf(field) === -1;
  }
}
