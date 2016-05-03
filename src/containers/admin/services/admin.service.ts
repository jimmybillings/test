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

  constructor(http: Http, apiConfig: ApiConfig, private store: Store<any>) { 
      this._http = http;
      this.adminStore = this.store.select('adminResources');
      this._apiConfig = apiConfig;
    }
  
  public getResources(queryObject: any): Observable<any> {
    let url = this.buildUrl(queryObject);
    return this._http.get(url, {headers: this._apiConfig.authHeaders()})
      .map((res: Response) => res.json());
  }
  
  public buildUrl(queryObject): string {
    return this._apiConfig.baseUrl() + 'api/identities/v1/' + queryObject.resource
                                     + '/search/?q=' + queryObject.q
                                     + '&s=' + queryObject.s
                                     + '&d=' + queryObject.d
                                     + '&i=' + queryObject.i
                                     + '&n=' + queryObject.n;
  }

    
  public setResources(data: any): void {
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
