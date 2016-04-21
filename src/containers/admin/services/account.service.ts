import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export const admin: Reducer<any> = (state = {}, action: Action) => {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class AccountService {
  
  public admin: Observable<any>;
  private _http: Http;
  private _apiConfig: ApiConfig;
  private _apiUrls: {
    get: string
  };

  constructor(
    http: Http,
    apiConfig: ApiConfig,
    private store: Store<any>
    ) { 
      this._http = http;
      this.admin = this.store.select('admin');
      this._apiConfig = apiConfig;
      this._apiUrls = {
        get: this._apiConfig.baseUrl() + 'api/identities/v1/account/search/?q=a&s=createdOn&d=false'
      };
    }
  
  public getAccountsForUser(user: Object, i: number): void {
    let url = this._apiUrls.get + `&i=${i}&n=2`;
    this._http.get(url, {headers: this._apiConfig.authHeaders()})
      .map((res: Response) => res.json())
      .subscribe(data => {
        this.store.dispatch({type: 'SET_ACCOUNTS', payload: {'accounts': data.items, 'currentPage': data.currentPage}});
      });
  }
}
