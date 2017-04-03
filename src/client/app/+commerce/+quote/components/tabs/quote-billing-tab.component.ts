import { Component } from '@angular/core';
import { CommerceBillingTab } from '../../../components/tabs/commerce-billing-tab';
import { QuoteEditService } from '../../../../shared/services/quote-edit.service';
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
    protected quoteEditService: QuoteEditService,
    protected uiConfig: UiConfig,
    protected user: UserService,
    protected currentUser: CurrentUserService,
    protected dialog: MdDialog,
  ) {
    super(userCan, quoteEditService, uiConfig, user, currentUser, dialog);
  }
}
