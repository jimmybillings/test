import { CommerceComponent } from './commerce.component';
import { Routes } from '@angular/router';
import { OrdersComponent } from './+order/+index/orders.component';
import { OrderShowComponent } from './+order/+show/order-show.component';
import { CartComponent } from './+cart/cart.component';
import { CartGuard } from './+cart/services/cart.guard';
import { CartResolver } from './+cart/services/cart.resolver';
import { OrderResolver } from './+order/services/order.resolver';
import { OrdersResolver } from './+order/services/orders.resolver';

export const COMMERCE_ROUTES: Routes = [
  {
    path: 'commerce',
    component: CommerceComponent,
    children: [
      { path: '', component: CartComponent, canActivate: [CartGuard], resolve: { cart: CartResolver } },
      { path: 'orders', component: OrdersComponent, resolve: { orders: OrdersResolver } },
      { path: 'order/:orderId', component: OrderShowComponent, resolve: { order: OrderResolver } }
    ]
  }
];

