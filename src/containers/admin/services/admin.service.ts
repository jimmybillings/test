import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
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
  private _identitesSearchConfig: {
    resource: string,
    q: string;
    s: string;
    d: string;
    i: number;
    n: number
  };

  constructor(http: Http, apiConfig: ApiConfig, private store: Store<any>) { 
      this._http = http;
      this.adminStore = this.store.select('adminResources');
      this._apiConfig = apiConfig;
      this._identitesSearchConfig = {
        resource: '',
        q: '',
        s: 'createdOn',
        d: 'false',
        i: 1,
        n: 10
      };
    }
  
  public getResources(queryObject: any): Observable<any> {
    let url = this.buildUrl(queryObject);
    return this._http.get(url, {headers: this._apiConfig.authHeaders()})
      .map((res: Response) => res.json());
  }
  
  public buildUrl(queryObject): string {
    this._identitesSearchConfig.resource = queryObject.resource;
    this._identitesSearchConfig.q = queryObject.q;
    this._identitesSearchConfig.i = queryObject.i;
    this._identitesSearchConfig.n = queryObject.n;
    this._identitesSearchConfig.s = queryObject.s;
    this._identitesSearchConfig.d = queryObject.d;
    return this._apiConfig.baseUrl() + 'api/identities/v1/' + this._identitesSearchConfig.resource
                                     + '/search/?q=' + this._identitesSearchConfig.q
                                     + '&s=' + this._identitesSearchConfig.s
                                     + '&d=' + this._identitesSearchConfig.d
                                     + '&i=' + (this._identitesSearchConfig.i - 1) 
                                     + '&n=' + this._identitesSearchConfig.n;
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
}
