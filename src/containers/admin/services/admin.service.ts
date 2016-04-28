import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

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
  private _routeConfig: {
    resource: string,
    q: string;
    s: string;
    d: boolean;
    i: number;
    n: number
  };

  constructor(http: Http, apiConfig: ApiConfig, private store: Store<any>) { 
      this._http = http;
      this.adminStore = this.store.select('adminResources');
      this._apiConfig = apiConfig;
      this._routeConfig = {
        resource: '',
        q: '',
        s: 'createdOn',
        d: false,
        i: 0,
        n: 10
      };
    }
  
  public getResource(resource: string, i: number): Observable<any> {
    let url = this.buildUrl(resource, i, this._routeConfig.s, this._routeConfig.d);
    return this._http.get(url, {headers: this._apiConfig.authHeaders()})
      .map((res: Response) => res.json());
  }
  
  public getSortedResources(resource: string, attribute: string, toggleOrder: boolean): Observable<any> {
    let url = this.buildUrl(resource, 0, attribute, toggleOrder);
    return this._http.get(url, {headers: this._apiConfig.authHeaders()})
      .map((res: Response) => res.json());
  }
  
  public buildUrl(resource: string, i: number, s: string, d: boolean): string {
    this._routeConfig.resource = resource;
    this._routeConfig.i = i;
    this._routeConfig.s = s;
    this._routeConfig.d = d;
    return this._apiConfig.baseUrl() + 'api/identities/v1/' + this._routeConfig.resource
                                     + '/search/?q=' + this._routeConfig.q
                                     + '&s=' + this._routeConfig.s
                                     + '&d=' + this._routeConfig.d
                                     + '&i=' + this._routeConfig.i
                                     + '&n=' + this._routeConfig.n;
  }

    
  public setResource(data: any): void {
    this.store.dispatch({type: 'ADMIN_SERVICE.SET_RESOURCES', payload: {
      'items': data.items,
      'pagination': {
        'totalCount': data.totalCount,
        'currentPage': data.currentPage,
        'hasNextPage': data.hasNextPage,
        'hasPreviousPage': data.hasPreviousPage,
        'numberOfPages': data.numberOfPages,
        'pageSize': data.pageSize
      }
    }});
  }
}
