import { UserManagementComponent } from './+user-management/user-management.component';
import { HomeComponent } from './+home/home.component';
import { ContentComponent } from './+content/content.component';
import { SearchComponent } from './+search/search.component';
import { AssetComponent } from './+asset/asset.component';
import { AdminComponent } from './+admin/admin.component';
import { CollectionsComponent } from './+collection/+index/collections.component';
import { CartComponent } from './+cart/cart.component';
import { OrderComponent } from './+order/order.component';
import { CartGuard } from './+cart/services/cart.guard';
import { AssetResolver } from './+asset/services/asset.resolver';
import { AssetGuard } from './+asset/services/asset.guard';
import { SearchResolver } from './+search/services/search.resolver';
import { CartResolver } from './+cart/services/cart.resolver';
import { Routes} from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notification', component: HomeComponent },
  { path: 'user', component: UserManagementComponent },
  { path: 'search', component: SearchComponent, resolve: {search: SearchResolver} },
  { path: 'asset/:name', component: AssetComponent, canActivate: [AssetGuard], resolve: {asset: AssetResolver} },
  { path: 'collection', component: CollectionsComponent },
  { path: 'content/:page', component: ContentComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'cart', component: CartComponent, canActivate: [CartGuard], resolve: { cart: CartResolver } },
  { path: 'order/:orderId', component: OrderComponent }
];
