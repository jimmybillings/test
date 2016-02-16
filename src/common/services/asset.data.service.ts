import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CurrentUser} from '../../common/models/current-user.model';
// import {Asset} from '../../common/interfaces/asset.interface';

@Injectable()
export class AssetData {

  constructor(
    public currentUser: CurrentUser,
    private http: Http,
    private apiConfig: ApiConfig) {}

  public searchAssetsUrl(loggedIn: boolean): string {
    return this.apiConfig.getApiRoot() + this.apiConfig.getAssetSearchPath(loggedIn);
  }
  
  public searchAssets(params: Object): Observable<any> {
    let options = this.apiConfig.getAssetSearchOptions(params, this.currentUser.loggedIn());
    return this.http.get(this.searchAssetsUrl(this.currentUser.loggedIn()), options)
      .map((res: Response) => {
        // console.log(res.json());
        return res.json();
      });
    // .map((assets: Array<{asset: Asset}>) => assets.map((asset: {asset: Asset}) => asset.asset));
    // .catch(this.handleError);
  }
}
