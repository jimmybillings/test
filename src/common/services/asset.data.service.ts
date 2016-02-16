import { Injectable } from 'angular2/core';
import { Http, RequestOptions, URLSearchParams } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CurrentUser} from '../../common/models/current-user.model';
// import {Asset} from '../../common/interfaces/asset.interface';

@Injectable()
export class AssetData {

  private _apiUrls: {
    getAssets: string,
    getAssetsAnonymous: string
  };

  constructor(
    public currentUser: CurrentUser,
    private http: Http, 
    private apiConfig: ApiConfig) {
    this._apiUrls = {
      getAssets: this.apiConfig.getApiRoot()+ 'assets-api/clip/user/search',
      getAssetsAnonymous: this.apiConfig.getApiRoot()+ 'assets-api/clip/anonymous/search'
    };
  }

  public getAssets(params: Object): Observable<any> {
    
    const search: URLSearchParams = new URLSearchParams();
    for(var param in params) search.set(param, params[param]);

    let loggedIn = this.currentUser.loggedIn();
    if (!loggedIn) search.set('siteName', this.apiConfig.getPortal());  
   
    let url = (loggedIn) ? this._apiUrls.getAssets : this._apiUrls.getAssetsAnonymous;
    let headers = (loggedIn) ? this.apiConfig.getAuthHeader() : void 0;
    let options = (loggedIn) ? { headers: headers, search: search } :{search: search };
    options = new RequestOptions(options);

    return this.http.get(url, options)
      .map((res: any) => {
        console.log(res.json());
        return res.json();
      });
  }
}
