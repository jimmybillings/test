import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WzDialogService } from '../../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { QuoteOptions } from '../../../../../shared/interfaces/commerce.interface';
import { QuoteEditService } from '../../../../../shared/services/quote-edit.service';
import { Router } from '@angular/router';
import { AppStore } from '../../../../../app.store';
import { Pojo } from '../../../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-send-tab-component',
  templateUrl: 'quote-edit-send-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditSendTabComponent {
  public config: Pojo;

  constructor(
    private dialogService: WzDialogService,
    private quoteEditService: QuoteEditService,
    private router: Router,
    private store: AppStore
  ) {
    this.config = this.store.snapshotCloned(state => state.uiConfig.components.cart.config);
  }

  public onOpenQuoteDialog(): void {
    this.dialogService.openFormDialog(
      this.config.createQuote.items,
      { title: 'QUOTE.CREATE_HEADER', submitLabel: 'QUOTE.SEND_BTN', autocomplete: 'off' },
      this.sendQuote
    );
  }

  private sendQuote(options: QuoteOptions): void {
    this.store.dispatch(factory =>
      factory.quoteEdit.sendQuote({
        ownerEmail: options.ownerEmail,
        expirationDate: new Date(options.expirationDate).toISOString(),
        purchaseType: options.purchaseType.split(' ').join(''),
        offlineAgreementId: options.offlineAgreementId
      })
    );
  }
}
