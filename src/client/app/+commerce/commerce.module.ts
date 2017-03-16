import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { CommerceComponent } from './commerce.component';
import { COMMERCE_ROUTES } from './commerce.routes';

// Cart Stuff
import { CartCapabilities } from './+cart/services/cart.capabilities';
import { CartComponent } from './+cart/cart.component';
import { CartTabComponent } from './+cart/components/tabs/cart-tab.component';
import { BillingTabComponent } from './+cart/components/tabs/billing-tab.component';
import { PaymentTabComponent } from './+cart/components/tabs/payment-tab.component';
import { ConfirmTabComponent } from './+cart/components/tabs/confirm-tab.component';
import { ProjectsComponent } from './+cart/components/projects.component';
import { LineItemsComponent } from './+cart/components/line-items.component';
import { AssetComponent } from './+cart/components/asset.component';
import { EditProjectComponent } from './+cart/components/edit-project.component';
import { AddressFormComponent } from './+cart/components/address-form.component';

// Order Stuff
import { OrdersComponent } from './+order/+index/orders.component';
import { OrderShowComponent } from './+order/+show/order-show.component';
import { OrderItemListComponent } from './+order/components/order-item-list.component';

// Quote Stuff
import { QuoteFormComponent } from './+cart/components/quote-form.component';
import { QuoteService } from './services/quote.service';


@NgModule({
  imports: [SharedModule, RouterModule.forChild(COMMERCE_ROUTES)],
  declarations: [
    CommerceComponent,
    CartComponent,
    CartTabComponent,
    BillingTabComponent,
    PaymentTabComponent,
    ConfirmTabComponent,
    ProjectsComponent,
    LineItemsComponent,
    AssetComponent,
    OrderShowComponent,
    OrdersComponent,
    OrderItemListComponent,
    EditProjectComponent,
    AddressFormComponent,
    QuoteFormComponent
  ],
  exports: [CommerceComponent, CartComponent, OrderShowComponent, OrdersComponent],
  providers: [CartCapabilities, QuoteService],
  entryComponents: [EditProjectComponent, AddressFormComponent, QuoteFormComponent]
})

export class CommerceModule { }
