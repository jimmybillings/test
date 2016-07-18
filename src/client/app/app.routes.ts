import {
  HomeComponent,
  UserManagementComponent,
  SearchComponent,
  AssetComponent,
  ContentComponent,
  CollectionsComponent,
  CollectionShowComponent,
  AdminComponent,
} from './imports/app.component.imports';

import { USER_ROUTES} from './+user-management/user-management.routes';
import { ADMIN_ROUTES} from './+admin/admin.routes';
import { AssetGuard } from './+asset/services/asset.guard';
import { AdminAuthGuard} from './+admin/services/admin.auth.guard';
import { AssetResolver } from './+asset/services/asset.resolver';
import { RouterConfig} from '@angular/router';


export const APP_ROUTES: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'notification', component: HomeComponent },
  { path: 'user', component: UserManagementComponent, children: USER_ROUTES },
  { path: 'search', component: SearchComponent },
  { path: 'asset/:name', component: AssetComponent, resolve: {asset: AssetResolver}, canActivate: [AssetGuard] },
  { path: 'collection', component: CollectionsComponent },
  { path: 'collection/:id', component: CollectionShowComponent },
  { path: 'content/:page', component: ContentComponent },
  { path: 'admin', component: AdminComponent, children: ADMIN_ROUTES, canActivate: [AdminAuthGuard] }
];
