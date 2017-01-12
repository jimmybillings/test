import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetData } from './asset.data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchContext } from '../../shared/services/search-context.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { FilterService } from '../../shared/services/filter.service';

@Injectable()
export class SearchResolver {
  constructor(
    private assets: AssetData,
    private searchContext: SearchContext,
    private userPreferences: UserPreferenceService,
    private filter: FilterService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.searchContext.create = route.params;
    this.filter.load(this.searchContext.state, this.userPreferences.state.displayFilterCounts).subscribe(() => { });
    return this.assets.searchAssets(this.searchContext.state);
  }
}
