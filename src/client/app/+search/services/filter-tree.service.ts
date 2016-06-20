import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { CurrentUser} from '../../shared/services/current-user.model';
import { Store, Reducer, Action} from '@ngrx/store';

const initFilters: any = {};

export const filters: Reducer<any> = (state: any = initFilters, action: Action) => {

  switch (action.type) {
    case 'FILTERS':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

/**
 * Service that provides access to the search api  
 * and returns search results
 */
@Injectable()
export class FilterTreeService {
  public filters: Observable<any>;
  constructor(
    public currentUser: CurrentUser,
    public http: Http,
    public apiConfig: ApiConfig,
    public store: Store<any>) {
    this.filters = this.store.select('filters');
  }


  public filterTreeUrl(loggedIn: boolean): string {
    return this.apiConfig.baseUrl() + this.getFilterTreePath(loggedIn);
  }

  public getFilterTreePath(isUserLoggedIn: boolean): string {
    return (isUserLoggedIn) ? 'api/assets/v1/filter/filterTree' : 'api/assets/v1/filter/anonymous/filterTree';
  }

  public getFilterTree(params: any): Observable<any> {
    params['counted'] = 'true';
    let options = this.getFilterSearchOptions(params, this.currentUser.loggedIn());
    return this.http.get(this.filterTreeUrl(this.currentUser.loggedIn()), options).map((res: Response) => (res.json()));
  }

  public getFilterSearchOptions(params: any, isUserLoggedIn: boolean): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in params) search.set(param, params[param]);

    if (!isUserLoggedIn) search.set('siteName', this.apiConfig.getPortal());

    let headers = (isUserLoggedIn) ? this.apiConfig.authHeaders() : void null;
    let options = (isUserLoggedIn) ? { headers: headers, search: search } : { search: search };
    return new RequestOptions(options);
  }

}
