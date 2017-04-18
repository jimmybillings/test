import { Component } from '@angular/core';
import { CommerceBillingTab } from '../../../components/tabs/commerce-billing-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { UiConfig } from '../../../../shared/services/ui.config';
import { UserService } from '../../../../shared/services/user.service';
import { CurrentUserService } from '../../../../shared/services/current-user.service';
import { MdDialog } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'quote-billing-tab',
  templateUrl: '../../../components/tabs/commerce-billing-tab.html'
})

export class QuoteBillingTabComponent extends CommerceBillingTab {
  constructor(
    public userCan: CommerceCapabilities,
    protected quoteService: QuoteService,
    protected uiConfig: UiConfig,
    protected user: UserService,
    protected currentUser: CurrentUserService,
    protected dialog: MdDialog,
  ) {
    super(userCan, quoteService, uiConfig, user, currentUser, dialog);
  }
}
