import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { QuoteEditService } from '../../../../shared/services/quote-edit.service';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'quote-confirm-tab',
  templateUrl: '../../../components/tabs/commerce-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteConfirmTabComponent extends CommerceConfirmTab {
  constructor(
    protected router: Router,
    public quoteEditService: QuoteEditService
  ) {
    super(router, quoteEditService);
  }
}
