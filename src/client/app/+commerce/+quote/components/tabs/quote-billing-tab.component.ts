import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommerceBillingTab } from '../../../components/tabs/commerce-billing-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { UserService } from '../../../../shared/services/user.service';
import { CurrentUserService } from '../../../../shared/services/current-user.service';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';

@Component({
  moduleId: module.id,
  selector: 'quote-billing-tab',
  templateUrl: '../../../components/tabs/commerce-billing-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteBillingTabComponent extends CommerceBillingTab {
  constructor(
    public userCan: CommerceCapabilities,
    protected quoteService: QuoteService,
    protected user: UserService,
    protected currentUser: CurrentUserService,
    protected dialog: WzDialogService
  ) {
    super(userCan, quoteService, user, currentUser, dialog);
  }
}
