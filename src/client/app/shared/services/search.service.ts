import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { SearchStore } from '../stores/search.store';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { GalleryViewService } from '../../shared/services/gallery-view.service';
/**
 * Service that provides access to the search api
 * and returns search results
 */
@Injectable()
export class SearchService {
  public data: Observable<any>;
  constructor(
    public currentUser: CurrentUserService,
    public userPreference: UserPreferenceService,
    public store: SearchStore,
    private galleryViewService: GalleryViewService,
    private api: ApiService) {
    this.data = this.store.data;
  }

  public searchAssets(params: any): Observable<any> {
    let cloneParams = this.normalizeParams(params);
    return this.api.get(
      Api.Assets,
      this.currentUser.loggedIn() ? 'search' : 'search/anonymous',
      { parameters: cloneParams, loading: true }
    ).do(response => this.store.storeAssets(response));
  }

  public reset(): void {
    this.store.storeAssets({ type: 'SEARCH.RESET' });
  }

  public clearAssets(): void {
    this.store.storeAssets({ type: 'SEARCH.CLEAR_ASSETS' });
  }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get(Api.Assets, `renditionType/downloadUrl/${id}`, { parameters: { type: compType } });
  }

  private normalizeParams(params: any): any {
    let cloneParams = JSON.parse(JSON.stringify(params));
    if (!cloneParams.q) cloneParams.q = 'itemType:clip';
    if (cloneParams.gq) cloneParams.gq = this.galleryViewService.stringifyPathForSearch(JSON.parse(cloneParams.gq));
    cloneParams['i'] = (parseFloat(cloneParams['i']) - 1).toString();
    cloneParams['viewType'] = this.userPreference.state.assetView;
    return cloneParams;
  }
}
