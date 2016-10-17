import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { CommerceComponent } from './commerce.component';
import { COMMERCE_ROUTES } from './commerce.routes';

// Cart Stuff
import { CartService } from './+cart/services/cart.service';
import { CartStore } from './+cart/services/cart.store';
import { CartCapabilities } from './+cart/services/cart.capabilities';
import { CartComponent } from './+cart/cart.component';
import { CartTabComponent } from './+cart/components/tabs/cart-tab.component';
import { ReviewTabComponent } from './+cart/components/tabs/review-tab.component';
import { BillingTabComponent } from './+cart/components/tabs/billing-tab.component';
import { PaymentTabComponent } from './+cart/components/tabs/payment-tab.component';
import { ConfirmTabComponent } from './+cart/components/tabs/confirm-tab.component';
import { ProjectsComponent } from './+cart/components/projects.component';
import { LineItemsComponent } from './+cart/components/line-items.component';
import { AssetComponent } from './+cart/components/asset.component';

// Order Stuff 
import { OrderComponent } from './+order/order.component';
import { OrderService } from './+order/services/order.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(COMMERCE_ROUTES)],
  declarations: [
    CommerceComponent,
    CartComponent,
    CartTabComponent,
    ReviewTabComponent,
    BillingTabComponent,
    PaymentTabComponent,
    ConfirmTabComponent,
    ProjectsComponent,
    LineItemsComponent,
    AssetComponent,
    OrderComponent
  ],
  exports: [CommerceComponent, CartComponent, OrderComponent],
  providers: [CartService, OrderService, CartStore, CartCapabilities]
})

export class CommerceModule { }
