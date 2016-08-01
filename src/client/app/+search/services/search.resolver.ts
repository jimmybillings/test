import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetData} from './asset.data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchContext } from '../../shared/services/search-context.service';
import { FilterService } from './filter.service';

@Injectable()
export class SearchResolver {
  constructor(private assets: AssetData, private filter: FilterService, private searchContext: SearchContext) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<any> {
    this.searchContext.create = route.params;
    this.filter.get(this.searchContext.state).take(1).subscribe();
    return this.assets.searchAssets(this.searchContext.state);
  }
}
