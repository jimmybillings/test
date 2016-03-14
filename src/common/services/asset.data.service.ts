import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CurrentUser} from '../../common/models/current-user.model';
// import {Asset} from '../../common/interfaces/asset.interface';
  
/**
 * Service that provides access to the search api  
 * and returns search results
 */  
@Injectable()
export class AssetData {

  constructor(
    public currentUser: CurrentUser,
    private http: Http,
    private apiConfig: ApiConfig) {}

  /**
   * @param loggedIn  Current user is logged in if localStorage token exists otherwise current user is not logged in.
   *                  This is needed to return URL from getAssetSearchPath()
   * @returns         URL for search api  concatenates the root URL with the search URL. Examples:
   *                  http://dev.crux.t3sandbox.xyz.:8080/api/assets/v1/clip/user/search if you're logged in
   *                  http://dev.crux.t3sandbox.xyz.:8080/api/assets/v1/clip/anonymous/search if you're logged out
   */
  public searchAssetsUrl(loggedIn: boolean): string {
    return this.apiConfig.baseUrl() + this.apiConfig.getAssetSearchPath(loggedIn);
  }
  
  /**
   * Ajax get request to search api to return matching assets and pagination information.
   * @param params    These are the url params when accessing search like q=goats (query string in search), n=25 (assets per page)
   * @returns         Response from search api. This includes information for pagination and assets for the search query.
   *                  Example: {items: Array[25], totalCount: 122, currentPage: 1, pageSize: 25, hasNextPage: true}
   */
  public searchAssets(params: {[key: string]: string}): Observable<any> {
    let options = this.apiConfig.getAssetSearchOptions(params, this.currentUser.loggedIn());
    return this.http.get(this.searchAssetsUrl(this.currentUser.loggedIn()), options)
      .map((res: Response) => {
        return res.json();
      });
    // .map((assets: Array<{asset: Asset}>) => assets.map((asset: {asset: Asset}) => asset.asset));
    // .catch(this.handleError);
  }
}
