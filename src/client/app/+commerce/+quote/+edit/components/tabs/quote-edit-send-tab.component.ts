import { Tab } from '../../../../components/tabs/tab';
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

export class QuoteEditSendTabComponent extends Tab {
  public config: Pojo;
  constructor(
    private store: AppStore
  ) {
    super();
    this.config = this.store.snapshotCloned(state => state.uiConfig.components.cart.config);
  }

  public onSubmitSendQuote(options: QuoteOptions): void {
    this.store.dispatch(factory => factory.quoteEdit.saveRecipientInformationOnQuote(
      {
        ownerEmail: options.ownerEmail,
        expirationDate: new Date(options.expirationDate).toISOString(),
        purchaseType: options.purchaseType.split(' ').join(''),
        offlineAgreementId: options.offlineAgreementId
      }
    ))
    this.goToNextTab();
  }

}
