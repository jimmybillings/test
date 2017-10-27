import { Component, ChangeDetectionStrategy } from '@angular/core';
import { QuoteOptions } from '../../../../../shared/interfaces/commerce.interface';
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
    private store: AppStore
  ) {
    this.config = this.store.snapshotCloned(state => state.uiConfig.components.cart.config);
  }

  public onSubmitSendQuote(options: QuoteOptions): void {
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
