import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { CartService } from './services/cart.service';
import { CartStore } from './services/cart.store';
import { CartComponent } from './cart.component';
import { MainTabComponent } from './components/tabs/main-tab.component';
import { ReviewTabComponent } from './components/tabs/review-tab.component';
import { BillingTabComponent } from './components/tabs/billing-tab.component';
import { PaymentTabComponent } from './components/tabs/payment-tab.component';
import { ConfirmTabComponent } from './components/tabs/confirm-tab.component';
import { ProjectsComponent } from './components/projects.component';
import { LineItemsComponent } from './components/line-items.component';
import { AssetComponent } from './components/asset.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CartComponent,
    MainTabComponent,
    ReviewTabComponent,
    BillingTabComponent,
    PaymentTabComponent,
    ConfirmTabComponent,
    ProjectsComponent,
    LineItemsComponent,
    AssetComponent
  ],
  exports: [CartComponent],
  providers: [CartService, CartStore]
})

export class CartModule {}
