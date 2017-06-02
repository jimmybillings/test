import { Component } from '@angular/core';
import { QuoteService } from '../../../../shared/services/quote.service';
import { Quote } from '../../../../shared/interfaces/commerce.interface';
import { Tab } from '../../../components/tabs/tab';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'quote-tab',
  templateUrl: 'quote-tab.html'
})

export class QuoteTabComponent extends Tab {
  public quote: Observable<Quote>;
  constructor(public quoteService: QuoteService, public userCan: CommerceCapabilities) {
    super();
    this.quote = this.quoteService.data.map(state => state.data);
  }

  public checkout(): void {
    this.quoteService.getPaymentOptions();
    this.goToNextTab();
  }
}
