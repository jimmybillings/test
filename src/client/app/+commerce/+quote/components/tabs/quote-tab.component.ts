import { Component } from '@angular/core';
import { QuoteService } from '../../../../shared/services/quote.service';
import { Quote } from '../../../../shared/interfaces/commerce.interface';
import { Tab } from '../../../components/tabs/tab';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { Observable } from 'rxjs/Observable';
import { FeatureStore } from '../../../../shared/stores/feature.store';
import { Feature } from '../../../../shared/interfaces/feature.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-tab',
  templateUrl: 'quote-tab.html'
})

export class QuoteTabComponent extends Tab {
  public quote: Observable<Quote>;

  constructor(public quoteService: QuoteService, public userCan: CommerceCapabilities, public featureStore: FeatureStore) {
    super();
    this.quote = this.quoteService.data.map(state => state.data);
  }

  public checkout(): void {
    this.quoteService.getPaymentOptions();
    this.goToNextTab();
  }

  public get shouldShowLicenseDetailsBtn(): boolean {
    return this.userCan.viewLicenseAgreementsButton(this.quoteService.hasAssetLineItems);
  }

  public showLicenseAgreements(): void {
    console.log('show license agreements');
  }
}
