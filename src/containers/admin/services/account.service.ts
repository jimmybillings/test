import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export const currentUserAccounts: Reducer<any> = (state = [], action: Action) => {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return [...state, action.payload];
    default:
      return state;
  }
};

@Injectable()
export class AccountService {
  
  public currentUserAccounts: Observable<Array<any>>;
  private _http: Http;
  private _apiConfig: ApiConfig;
  private _userAccountIds: any;
  private _apiUrls: {
    get: string
  };

  constructor(
    http: Http,
    apiConfig: ApiConfig,
    private store: Store<any>) { 
      this._http = http;
      this.currentUserAccounts = this.store.select('currentUserAccounts');
      this._apiConfig = apiConfig;
      this._apiUrls = {
        get: this._apiConfig.baseUrl() + 'api/identities/v1/account/'
      };
    }
  
  public getAccountsForUser(user: any): void {
    user._currentUser.subscribe(data => this._userAccountIds = data.accountIds);
    this._userAccountIds.forEach(id => {
      return this._http.get(this._apiUrls.get + id, {headers: this._apiConfig.authHeaders()})
        .map((res: Response) => res.json())
        .subscribe(account => this.store.dispatch({ type: 'ADD_ACCOUNT', payload: account}));
    });
  }
}
