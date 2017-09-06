import { Routes } from '@angular/router';
import { OrdersComponent } from './+order/+index/orders.component';
import { OrderShowComponent } from './+order/+show/order-show.component';
import { CartComponent } from './+cart/cart.component';
import { CartAssetComponent } from './+cart/components/cart-asset.component';
import { CartGuard } from './+cart/services/cart.guard';
import { CartResolver } from './+cart/services/cart.resolver';
import { CartAssetResolver } from './+cart/services/cart-asset.resolver';
import { OrderAssetComponent } from './+order/components/order-asset.component';
import { OrderResolver } from './+order/services/order.resolver';
import { OrderAssetResolver } from './+order/services/order-asset.resolver';
import { OrdersResolver } from './+order/services/orders.resolver';
import { QuoteShowComponent } from './+quote/+show/quote-show.component';
import { QuoteAssetComponent } from './+quote/components/quote-asset.component';
import { QuoteShowAssetComponent } from './+quote/components/quote-show-asset.component';
import { QuotesComponent } from './+quote/+index/quotes.component';
import { QuoteResolver } from './+quote/services/quote.resolver';
import { QuoteAssetResolver } from './+quote/services/quote-asset.resolver';
import { QuoteShowAssetResolver } from './+quote/services/quote-show-asset.resolver';
import { QuotesResolver } from './+quote/services/quotes.resolver';
import { QuoteEditComponent } from './+quote/+edit/quote-edit.component';
import { QuoteEditResolver } from './+quote/services/quote-edit.resolver';
import { QuoteEditGuard } from './+quote/services/quote-edit.guard';


export const COMMERCE_ROUTES: Routes = [
  { path: 'cart', component: CartComponent, resolve: { cart: CartResolver } },
  { path: 'cart/asset/:uuid', component: CartAssetComponent, resolve: { asset: CartAssetResolver } },
  { path: 'orders', component: OrdersComponent, resolve: { orders: OrdersResolver } },
  { path: 'orders/:orderId', component: OrderShowComponent, resolve: { order: OrderResolver } },
  { path: 'orders/:orderId/asset/:uuid', component: OrderAssetComponent, resolve: { orderAsset: OrderAssetResolver } },
  { path: 'quotes', component: QuotesComponent, resolve: { quotes: QuotesResolver } },
  { path: 'quotes/:quoteId', component: QuoteShowComponent, resolve: { quote: QuoteResolver } },
  { path: 'quotes/:quoteId/asset/:uuid', component: QuoteShowAssetComponent, resolve: { quoteAsset: QuoteShowAssetResolver } },
  { path: 'active-quote', component: QuoteEditComponent, resolve: { quote: QuoteEditResolver }, canActivate: [QuoteEditGuard] },
  { path: 'active-quote/asset/:uuid', component: QuoteAssetComponent, resolve: { quoteAsset: QuoteAssetResolver } }
];

