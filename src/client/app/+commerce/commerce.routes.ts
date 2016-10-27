import { CommerceComponent } from './commerce.component';
import { Routes } from '@angular/router';
import { OrderShowComponent } from './+order/+show/order-show.component';
import { CartComponent } from './+cart/cart.component';
import { CartGuard } from './+cart/services/cart.guard';
import { CartResolver } from './+cart/services/cart.resolver';
import { OrderResolver } from './+order/services/order.resolver';

export const COMMERCE_ROUTES: Routes = [
  {
    path: '',
    component: CommerceComponent,
    children: [
      { path: 'cart', component: CartComponent, canActivate: [CartGuard], resolve: { cart: CartResolver } },
      { path: 'order/:orderId', component: OrderShowComponent, resolve: { order: OrderResolver } }
    ]
  }
];

