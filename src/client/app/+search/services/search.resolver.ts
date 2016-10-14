import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetData} from './asset.data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchContext } from '../../shared/services/search-context.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { UiState } from '../../shared/services/ui.state';
import { SortDefinitionsService } from '../../shared/services/sort-definitions.service';

@Injectable()
export class SearchResolver {
  constructor(
    private assets: AssetData,
    private sortDefinitions: SortDefinitionsService,
    private searchContext: SearchContext,
    public userPreference: UserPreferenceService,
    public uiState: UiState) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.searchContext.create = route.params;
    this.userPreference.updateSortPreference(route.params['sortId']);
    return this.assets.searchAssets(this.searchContext.state);
  }
}
