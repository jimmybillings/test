import { Routes } from '@angular/router';
import { OrdersComponent } from './+order/+index/orders.component';
import { OrderShowComponent } from './+order/+show/order-show.component';
import { CartComponent } from './+cart/cart.component';
import { CartGuard } from './+cart/services/cart.guard';
import { CartResolver } from './+cart/services/cart.resolver';
import { OrderResolver } from './+order/services/order.resolver';
import { OrdersResolver } from './+order/services/orders.resolver';
import { QuoteShowComponent } from './+quote/+show/quote-show.component';
import { QuotesComponent } from './+quote/+index/quotes.component';
import { QuoteResolver } from './+quote/services/quote.resolver';
import { QuotesResolver } from './+quote/services/quotes.resolver';
import { QuoteEditComponent } from './+quote/+edit/quote-edit.component';
import { QuoteEditResolver } from './+quote/services/quote-edit.resolver';
import { QuoteEditGuard } from './+quote/services/quote-edit.guard';

export const COMMERCE_ROUTES: Routes = [
  { path: 'cart', component: CartComponent, resolve: { cart: CartResolver } },
  { path: 'cart/asset/:uuid', component: CartComponent, resolve: { cart: CartResolver } },
  { path: 'orders', component: OrdersComponent, resolve: { orders: OrdersResolver } },
  { path: 'orders/:orderId', component: OrderShowComponent, resolve: { order: OrderResolver } },
  { path: 'orders/orderId:/asset/:uuid', component: CartComponent, resolve: { cart: CartResolver } },
  { path: 'quotes', component: QuotesComponent, resolve: { quotes: QuotesResolver } },
  { path: 'quotes/:quoteId', component: QuoteShowComponent, resolve: { quote: QuoteResolver } },
  { path: 'quotes/orderId:/asset/:uuid', component: CartComponent, resolve: { cart: CartResolver } },
  { path: 'activeQuote', component: QuoteEditComponent, resolve: { quote: QuoteEditResolver }, canActivate: [QuoteEditGuard] },
  { path: 'activeQuote/asset/:uuid', component: CartComponent, resolve: { cart: CartResolver } },
];

