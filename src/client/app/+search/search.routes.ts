import { Routes } from '@angular/router';

import { AssetComponent } from '../+asset/asset.component';
import { SearchAssetResolver } from './services/search-asset.resolver';
import { SearchAssetGuard } from './services/search-asset.guard';
import { SearchComponent } from './search.component';
import { SearchResolver } from './services/search.resolver';

export const SEARCH_ROUTES: Routes = [
  {
    path: 'search',
    children: [
      { path: '', component: SearchComponent, resolve: { search: SearchResolver } },
      { path: 'asset/:id', component: AssetComponent, resolve: { asset: SearchAssetResolver }, canActivate: [SearchAssetGuard] }
    ]
  }
];
