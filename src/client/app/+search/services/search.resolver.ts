import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../../shared/services/search.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchContext } from '../../shared/services/search-context.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';
import { FilterService } from '../../shared/services/filter.service';

@Injectable()
export class SearchResolver {
  constructor(
    private search: SearchService,
    private searchContext: SearchContext,
    private userPreferences: UserPreferenceService,
    private filter: FilterService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.searchContext.create = route.params;
    this.filter.load(this.searchContext.state, this.userPreferences.state.displayFilterCounts).subscribe(() => { });
    return this.search.searchAssets(this.searchContext.state);
  }
}
