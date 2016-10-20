import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AssetData} from './asset.data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchContext } from '../../shared/services/search-context.service';

@Injectable()
export class SearchResolver {
  constructor(
    private assets: AssetData,
    private searchContext: SearchContext) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.searchContext.create = route.params;
    return this.assets.searchAssets(this.searchContext.state);
  }
}
