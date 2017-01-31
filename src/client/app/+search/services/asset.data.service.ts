import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CurrentUser } from '../../shared/services/current-user.model';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { AssetStore } from './asset.store';
import { UserPreferenceService } from '../../shared/services/user-preference.service';

/**
 * Service that provides access to the search api  
 * and returns search results
 */
@Injectable()
export class AssetData {
  public data: Observable<any>;
  constructor(
    public currentUser: CurrentUser,
    public userPreference: UserPreferenceService,
    private api: ApiService,
    public store: AssetStore) {
    this.data = this.store.data;
  }

  public searchAssets(params: any): Observable<any> {
    let cloneParams = JSON.parse(JSON.stringify(params));
    cloneParams['i'] = (parseFloat(cloneParams['i']) - 1).toString();
    cloneParams['viewType'] = this.userPreference.state.assetView;
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
}
