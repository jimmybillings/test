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
    return Observable.forkJoin([
      this.assets.searchAssets(this.searchContext.state),
      this.sortDefinitions.getSortOptions()
    ]).map((data: any) => {
      let stickySort: any = this.findStickySort(data[1].list) || data[1].list[0].first;
      this.sortDefinitions.update({ sorts: data[1].list, currentSort: stickySort });
    });
  }

  private findStickySort(sorts: Array<any>): any {
    for (let group of sorts) {
      for (let definition in group) {
        if (group[definition].id === parseInt(this.userPreference.state.stickySort)) {
          return group[definition];
        };
      };
    };
  }
}
