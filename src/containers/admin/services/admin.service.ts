import { Injectable } from 'angular2/core';
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
  private _http: Http;
  private _apiConfig: ApiConfig;

  constructor(http: Http, apiConfig: ApiConfig, private store: Store<any>) { 
      this._http = http;
      this.adminStore = this.store.select('adminResources');
      this._apiConfig = apiConfig;
    }
  
  public getResources(queryObject: { [key: string]: string }, resource: string): Observable<any> {
    queryObject['i'] = (parseFloat(queryObject['i']) - 1).toString();
    let url = this._getIdentitiesSearchPath(resource);
    let options = this._getIdentitiesSearchOptions(queryObject);
    return this._http.get(url, options)
      .map((res: Response) => res.json());
  }
  
  // public buildUrl(queryObject: any, resource: string): string {
  //   return this._apiConfig.baseUrl() + 'api/identities/v1/' + resource
  //                                    + '/search/?q=' + queryObject.q
  //                                    + '&s=' + queryObject.s
  //                                    + '&d=' + queryObject.d
  //                                    + '&i=' + (queryObject.i - 1)
  //                                    + '&n=' + queryObject.n;
  // }

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
  
  private _getIdentitiesSearchOptions(queryObject: { [key: string]: string }): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) {
      search.set(param, queryObject[param]);
    }
    let headers = this._apiConfig.authHeaders();
    let options = { headers: headers, search: search};
    return new RequestOptions(options);
  }
  
  private _getIdentitiesSearchPath(resource: string): string {
    return this._apiConfig.baseUrl() + 'api/identities/v1/' + resource + '/search';
  }
}
