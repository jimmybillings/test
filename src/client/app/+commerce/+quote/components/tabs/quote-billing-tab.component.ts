import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommerceBillingTab } from '../../../components/tabs/commerce-billing-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { UserService } from '../../../../shared/services/user.service';
import { CurrentUserService } from '../../../../shared/services/current-user.service';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AppStore } from '../../../../app.store';
import { ViewAddress } from '../../../../shared/interfaces/user.interface';
import { Common } from '../../../../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'quote-billing-tab',
  templateUrl: '../../../components/tabs/commerce-billing-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteBillingTabComponent extends CommerceBillingTab implements OnInit {
  constructor(
    public userCan: CommerceCapabilities,
    protected quoteService: QuoteService,
    protected user: UserService,
    protected currentUser: CurrentUserService,
    protected dialog: WzDialogService,
    protected store: AppStore
  ) {
    super(userCan, quoteService, user, currentUser, dialog, store);
  }

  ngOnInit() {
    this.quoteBillingAccountInfo = this.store.select(state => state.quoteShow.data.billingAccountData);
    this.quoteInvoiceContactInfo = this.store.select(state => state.quoteShow.data.invoiceContact);
    this.orderInProgress = this.store.select(state => state.checkout);
    if (this.store.snapshot(state => !state.quoteShow.data.billingAccountId || !state.quoteShow.data.invoiceContact)) {
      this.fetchAddresses().subscribe();
    }
  }
}
