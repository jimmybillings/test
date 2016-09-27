import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetData} from './asset.data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchContext } from '../../shared/services/search-context.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { UiState } from '../../shared/services/ui.state';

@Injectable()
export class SearchResolver {
  constructor(
    private assets: AssetData,
    private searchContext: SearchContext,
    public userPreference: UserPreferenceService,
    public uiState: UiState) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.searchContext.create = this.sanitize(route.params);
    if (this.userPreference.state.displayFilterCounts) this.uiState.loading(true);
    return this.assets.searchAssets(this.searchContext.state);
  }

  public sanitize(routeParams: any): any {
    let newParams: any = JSON.parse(JSON.stringify(routeParams));
    for (let param in newParams) {
      if (newParams[param] === '' || newParams[param] === 'true') {
        delete (newParams[param]);
        return newParams;
      }
      return newParams;
    }
  }
}
