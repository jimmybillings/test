import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export const currentUserAccounts: Reducer<any> = (state = [], action: Action) => {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return Object.assign([], state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class AccountService {
  
  public currentUserAccounts: Observable<Array<any>>;
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
      this.currentUserAccounts = this.store.select('currentUserAccounts');
      this._apiConfig = apiConfig;
      this._apiUrls = {
        get: this._apiConfig.baseUrl() + 'api/identities/v1/account/search/?q=a&s=createdOn&d=false&i=0&n=20'
      };
    }
  
  public getAccountsForUser(user: any): void {
    this._http.get(this._apiUrls.get, {headers: this._apiConfig.authHeaders()})
      .map((res: Response) => res.json().items)
      .subscribe(data => this.store.dispatch({type: 'ADD_ACCOUNT', payload: data}));
  }
}
