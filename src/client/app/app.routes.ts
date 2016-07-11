import { RouterConfig } from '@angular/router';
import {
  HomeComponent,
  UserManagementComponent,
  SearchComponent,
  AssetComponent,
  ContentComponent,
  CollectionsComponent,
  CollectionShowComponent,
  AdminComponent,
} from './platform/app.component.imports';

import { USER_ROUTES} from './+user-management/user-management.routes';
import { ADMIN_ROUTES} from './+admin/admin.routes';
import { AssetGuard } from './+asset/services/asset.guard';
import {AdminAuthGuard} from './+admin/services/admin.auth.guard';

export const APP_ROUTES: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'notification', component: HomeComponent },
  { path: 'user', component: UserManagementComponent, children: USER_ROUTES },
  { path: 'search', component: SearchComponent },
  { path: 'asset/:name', component: AssetComponent, canActivate: [AssetGuard] },
  { path: 'collection', component: CollectionsComponent },
  { path: 'collection/:id', component: CollectionShowComponent },
  { path: 'content/:page', component: ContentComponent },
  { path: 'admin', component: AdminComponent, children: ADMIN_ROUTES, canActivate: [AdminAuthGuard] }
];
