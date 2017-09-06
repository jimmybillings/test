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
import { QuotesComponent } from './+quote/+index/quotes.component';
import { QuoteResolver } from './+quote/services/quote.resolver';
import { QuoteAssetResolver } from './+quote/services/quote-asset.resolver';
import { QuotesResolver } from './+quote/services/quotes.resolver';
import { QuoteEditComponent } from './+quote/+edit/quote-edit.component';
import { QuoteEditResolver } from './+quote/services/quote-edit.resolver';
import { QuoteEditGuard } from './+quote/services/quote-edit.guard';


export const COMMERCE_ROUTES: Routes = [
  {
    path: 'cart', component: CartComponent, resolve: { cart: CartResolver },
    children: [
      { path: 'asset/:uuid', component: CartAssetComponent, resolve: { asset: CartAssetResolver } }
    ]
  },
  {
    path: 'orders', component: OrdersComponent, resolve: { orders: OrdersResolver },
    children: [
      { path: ':orderId', component: OrderShowComponent, resolve: { order: OrderResolver } },
      { path: ':orderId/asset/:uuid', component: CartComponent, resolve: { cart: CartResolver } },
    ]
  },
  {
    path: 'quotes', component: QuotesComponent, resolve: { quotes: QuotesResolver },
    children: [
      { path: ':quoteId', component: QuoteShowComponent, resolve: { quote: QuoteResolver } },
      { path: ':quoteId/asset/:uuid', component: CartComponent, resolve: { cart: CartResolver } },
    ]
  },
  {
    path: 'active-quote', component: QuoteEditComponent, resolve: { quote: QuoteEditResolver }, canActivate: [QuoteEditGuard],
    children: [
      { path: 'asset/:uuid', component: QuoteAssetComponent, resolve: { cart: QuoteAssetResolver } }
    ]
  }
];

