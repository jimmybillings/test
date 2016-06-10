import { Injectable } from '@angular/core';
import { RouteSegment } from '@angular/router';
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

  public operatorMap: any;
  public pageStore: Observable<any>;
  public adminStore: Observable<any>;

  constructor(public http: Http,
              public apiConfig: ApiConfig,
              public routeSegment: RouteSegment,
              private store: Store<any>) {
    this.adminStore = this.store.select('adminResources');
    this.operatorMap = {
      'before': 'LT',
      'after': 'GT'
    };
  }

  public getResources(queryObject: any, resource: string): Observable<any> {
    queryObject['i'] = (parseFloat(queryObject['i']) - 1).toString();
    let url = this.getIdentitiesSearchPath(resource);
    let options = this.getIdentitiesSearchOptions(queryObject);
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  public getResource(resourceType: string, resourceId: string): Observable<any> {
    let url = this.buildGetUrl(resourceType, resourceId);
    let headers = this.apiConfig.authHeaders();
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  public postResource(formData: any, resource: string): Observable<any> {
    let url = this.buildPostUrl(resource);
    let headers = this.apiConfig.authHeaders();
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(formData);
    return this.http.post(url, body, options).map((res: Response) => res.json());
  }

  public put(resource: string, resourceId: string, formData: any): Observable<any> {
    let url = this.buildGetUrl(resource, resourceId);
    let headers = this.apiConfig.authHeaders();
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(formData);
    return this.http.put(url, body, options).map((res: Response) => res.json());
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

  public buildSearchTerm(filterParams: any): any {
    let params = this.sanitizeFormInput(filterParams);
    let rawFields = this.buildFields(params);
    let rawValues = this.buildValues(params);
    let fields = rawFields.filter(this.removeFields).join(',');
    let values = rawValues.filter(this.removeFields).join(',');
    return { fields, values };
  }

  public buildRouteParams(dynamicParams?: any): any {
    let s = this.routeSegment.getParam('s') || 'createdOn';
    let d = (this.routeSegment.getParam('d') ? true : false);
    let i = parseInt(this.routeSegment.getParam('i')) || 1;
    let n = parseInt(this.routeSegment.getParam('n')) || 10;
    let fields = this.routeSegment.getParam('fields') || '';
    let values = this.routeSegment.getParam('values') || '';
    let params = { i, n, s, d, fields, values };
    return dynamicParams ? Object.assign(params, dynamicParams) : params;
  }

  public getIdentitiesSearchOptions(queryObject: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    let headers = this.apiConfig.authHeaders();
    let options = { headers: headers, search: search };
    return new RequestOptions(options);
  }

  public buildPostUrl(resource: string): string {
    return this.apiConfig.baseUrl() + 'api/identities/v1/' + resource;
  }

  public buildGetUrl(resource: string, id: string): string {
    return this.apiConfig.baseUrl() + 'api/identities/v1/' + resource + '/' + id;
  }

  public getIdentitiesSearchPath(resource: string): string {
    return this.apiConfig.baseUrl() + 'api/identities/v1/' + resource + '/searchFields/?';
  }

  public sanitizeFormInput(params: any): any {
    for (var param in params) {
      if ((param === 'createdOn' || param === 'lastUpdated') && params[param] === '') {
        let date = new Date();
        params[param] = date.setDate(date.getDate() + 1) * 1000;
      } else if (params[param] === '') {
        delete params[param];
      }
    }
    return params;
  }

  public buildValues(filterParams: any): Array<string> {
    return Object.keys(filterParams).reduce((prev, current) => {
      if (current === 'createdOn' || current === 'lastUpdated') {
        let date = new Date(filterParams[current]);
        prev.push(encodeURI((date.getTime() / 1000).toString()));
      } else {
        prev.push(encodeURI(filterParams[current]));
      }
      return prev;
    }, []);
  }

  public buildFields(filterParams: any): Array<string> {
    let fields = Object.keys(filterParams);
    return fields.reduce((prev, current, index) => {
      if (current === 'DATE') {
        prev.push(current + ':' + this.operatorMap[filterParams[current]] + ':' + fields[index + 1]);
      } else {
        prev.push(current);
      }
      return prev;
    }, []);
  }

  public removeFields(value: any): boolean {
    let fieldsToRemove = ['createdOn', 'lastUpdated', 'before', 'after'];
    return !(fieldsToRemove.indexOf(value) > -1);
  }
}
