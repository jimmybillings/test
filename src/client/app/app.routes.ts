import { UserManagementComponent } from './+user-management/user-management.component';
import { HomeComponent } from './+home/home.component';
import { CollectionsComponent } from './+collection/+index/collections.component';
import { WzNotFoundComponent } from './shared/components/wz-not-found/wz-not-found.component';
import { GalleryViewComponent } from './+gallery-view/gallery-view.component';
import { GalleryViewResolver } from './+gallery-view/services/gallery-view.resolver';
import { HomeResolver } from './+home/services/home.resolver';

import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [

  { path: '', component: HomeComponent, resolve: { gallery: HomeResolver } },
  { path: 'notification', component: HomeComponent },
  { path: 'user', component: UserManagementComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'gallery-view', component: GalleryViewComponent, resolve: { gallery: GalleryViewResolver } },
  { path: '404', component: WzNotFoundComponent },
  { path: '**', component: WzNotFoundComponent }

];
