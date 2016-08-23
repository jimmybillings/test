import { UserManagementComponent } from './+user-management/user-management.component';
import { HomeComponent } from './+home/home.component';
import { ContentComponent } from './+content/content.component';
import { SearchComponent } from './+search/search.component';
import { AssetComponent } from './+asset/asset.component';
import { AdminComponent } from './+admin/admin.component';
import { CollectionsComponent } from './+collection/+index/collections.component';

import { AssetGuard } from './+asset/services/asset.guard';
import { AdminAuthGuard} from './+admin/services/admin.auth.guard';
import { AssetResolver } from './+asset/services/asset.resolver';
import { SearchResolver } from './+search/services/search.resolver';
import { Routes} from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notification', component: HomeComponent },
  { path: 'user', component: UserManagementComponent },
  { path: 'search', component: SearchComponent, resolve: {search: SearchResolver} },
  { path: 'asset/:name', component: AssetComponent, resolve: {asset: AssetResolver}, canActivate: [AssetGuard] },
  { path: 'collection', component: CollectionsComponent },
  { path: 'content/:page', component: ContentComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminAuthGuard] }
];
