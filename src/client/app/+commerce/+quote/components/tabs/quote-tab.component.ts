import { Component } from '@angular/core';
import { QuoteService } from '../../../../shared/services/quote.service';
import { Quote } from '../../../../shared/interfaces/quote.interface';
import { Tab } from '../../../components/tabs/tab';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { Observable } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'quote-tab',
  templateUrl: 'quote-tab.html'
})

export class QuoteTabComponent extends Tab {
  public quote: Observable<Quote>;
  constructor(private quoteService: QuoteService, public userCan: CommerceCapabilities) {
    super();
    this.quote = this.quoteService.data;
  }
}
