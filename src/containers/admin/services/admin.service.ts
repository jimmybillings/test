import { Injectable } from 'angular2/core';
import { RouteParams } from 'angular2/router';
import { Http, Response, URLSearchParams, RequestOptions } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

const adminState = {items: [], pagination: {}};
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
  public pageStore: Observable<any>;
  public operatorMap: Object;
  public routeParams: RouteParams;
  private _http: Http;
  private _apiConfig: ApiConfig;

  constructor(http: Http, apiConfig: ApiConfig, routeParams: RouteParams, private store: Store<any>) { 
      this._http = http;
      this.adminStore = this.store.select('adminResources');
      this._apiConfig = apiConfig;
      this.routeParams = routeParams;
      this.operatorMap = {
        'before': 'LT',
        'after': 'GT'
      };
    }
  
  public getResources(queryObject: any, resource: string): Observable<any> {
    queryObject['i'] = (parseFloat(queryObject['i']) - 1).toString();
    let url = this.getIdentitiesSearchPath(queryObject, resource);
    let options = this.getIdentitiesSearchOptions(queryObject);
    return this._http.get(url, options).map((res: Response) => res.json());
  }

  public setResources(data: any): void {
    this.store.dispatch({type: 'ADMIN_SERVICE.SET_RESOURCES', payload: {
      'items': data.items,
      'pagination': {
        'totalCount': data.totalCount,
        'currentPage': data.currentPage + 1,
        'hasNextPage': data.hasNextPage,
        'hasPreviousPage': data.hasPreviousPage,
        'numberOfPages': data.numberOfPages,
        'pageSize': data.pageSize
      }
    }});
  }
  
  public buildSearchTerm(filterParams: any): any {
    let params = this.sanitizeFormInput(filterParams);
    let rawFields = this.buildFields(params);
    let rawValues = this.buildValues(params);
    let fields = rawFields.filter(this.removeFields).join(',');
    let values = rawValues.filter(this.removeFields).join(',');
    return {fields, values};
  }
  
  public buildRouteParams(pageSize, dynamicParams?: any): any {
    let s = this.routeParams.get('s') || 'createdOn';
    let d = (this.routeParams.get('d') ? true : false);
    let i = parseInt(this.routeParams.get('i')) || 1;
    let n = parseInt(this.routeParams.get('n')) || pageSize;
    let fields = this.routeParams.get('fields') || '';
    let values = this.routeParams.get('values') || '';
    let params = { i, n, s, d, fields, values };
    return dynamicParams ? Object.assign(params, dynamicParams) : params;
  }
  
  private getIdentitiesSearchOptions(queryObject: { [key: string]: string }): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    let headers = this._apiConfig.authHeaders();
    let options = { headers: headers, search: search};
    return new RequestOptions(options);
  }
  
  private getIdentitiesSearchPath(queryObject: any, resource: string): string {
    if (Object.keys(queryObject).indexOf('fields') > -1) {
      return this._apiConfig.baseUrl() + 'api/identities/v1/' + resource + '/searchFields/?';
    } else {
      return this._apiConfig.baseUrl() + 'api/identities/v1/' + resource + '/search';
    }
  }
  
  private sanitizeFormInput(params: any): any {
    for (var param in params) {if (params[param] === '') delete params[param];}
    return params;
  }
  
  private buildValues(filterParams: any): Array<string> {
    return Object.keys(filterParams).reduce((prev, current) => {
      if (current === 'createdOn' || current === 'lastUpdated') {
        let date = new Date(filterParams[current]);
        prev.push(encodeURI((date.getTime()/1000).toString()));
      } else {
        prev.push(encodeURI(filterParams[current])); 
      }
      return prev;
    }, []);
  }
  
  private buildFields(filterParams: any): Array<string> {
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
  
  private removeFields(value): boolean {
    let fieldsToRemove = ['createdOn', 'lastUpdated', 'before', 'after'];
    return !(fieldsToRemove.indexOf(value) > -1);
  }
}
