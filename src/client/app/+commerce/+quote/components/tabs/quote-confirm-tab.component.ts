import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { Router } from '@angular/router';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';

@Component({
  moduleId: module.id,
  selector: 'quote-confirm-tab',
  templateUrl: '../../../components/tabs/commerce-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteConfirmTabComponent extends CommerceConfirmTab {
  constructor(
    protected router: Router,
    public quoteService: QuoteService,
    public userCan: CommerceCapabilities
  ) {
    super(router, quoteService, userCan);
  }
}
