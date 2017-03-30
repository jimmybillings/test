import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { CommerceComponent } from './commerce.component';
import { COMMERCE_ROUTES } from './commerce.routes';

// Cart Stuff
// tabs
import { CartCapabilities } from './+cart/services/cart.capabilities';
import { CartComponent } from './+cart/cart.component';
import { CartTabComponent } from './components/tabs/cart-tab.component';
import { BillingTabComponent } from './components/tabs/billing-tab.component';
import { PaymentTabComponent } from './components/tabs/payment-tab.component';
import { ConfirmTabComponent } from './components/tabs/confirm-tab.component';
// project
import { ProjectsComponent } from './components/project/projects.component';
import { ProjectInfoComponent } from './components/project/project-info.component';
import { ProjectAssetInfoComponent } from './components/project/project-asset-info.component';
import { ProjectPriceInfoComponent } from './components/project/project-price-info.component';
import { ProjectActionsComponent } from './components/project/project-actions.component';
import { ProjectEditComponent } from './components/project/project-edit.component';
// lineitem
import { LineItemsComponent } from './components/line-item/line-items.component';
import { LineItemTranscodeSelectComponent } from './components/line-item/line-item-transcode-select.component';
import { LineItemActionsComponent } from './components/line-item/line-item-actions.component';
import { LineItemPriceComponent } from './components/line-item/line-item-price.component';
// asset
import { AssetComponent } from './components/asset/asset.component';
import { AssetThumbnailComponent } from './components/asset/asset-thumbnail.component';
import { AssetInfoComponent } from './components/asset/asset-info.component';

// miscellaneous
import { AddressFormComponent } from './components/address-form/address-form.component';
import { QuoteFormComponent } from './+quote/components/quote-form.component';
import { AdministerQuoteComponent } from './+quote/components/administer-quote.component';
import { QuotePurchaseTypeComponent } from './+quote/components/quote-purchase-type.component';

// Order Stuff
import { OrdersComponent } from './+order/+index/orders.component';
import { OrderShowComponent } from './+order/+show/order-show.component';
import { OrderItemListComponent } from './+order/components/order-item-list.component';

// Quote Stuff
import { QuoteComponent } from './+quote/+show/quote.component';
import { QuotesComponent } from './+quote/+index/quotes.component';


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
        ProjectInfoComponent,
        ProjectAssetInfoComponent,
        ProjectPriceInfoComponent,
        ProjectActionsComponent,
        ProjectEditComponent,
        LineItemsComponent,
        LineItemTranscodeSelectComponent,
        LineItemActionsComponent,
        LineItemPriceComponent,
        AssetComponent,
        AssetThumbnailComponent,
        AssetInfoComponent,
        OrderShowComponent,
        OrdersComponent,
        OrderItemListComponent,
        AddressFormComponent,
        QuoteFormComponent,
        QuoteComponent,
        QuotesComponent,
        AdministerQuoteComponent,
        QuotePurchaseTypeComponent
    ],
    exports: [CommerceComponent, CartComponent, OrderShowComponent, OrdersComponent],
    providers: [CartCapabilities],
    entryComponents: [ProjectEditComponent, AddressFormComponent, QuoteFormComponent]
})

export class CommerceModule { }
