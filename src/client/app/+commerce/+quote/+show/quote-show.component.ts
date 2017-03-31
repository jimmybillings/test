import { Component } from '@angular/core';
import { QuoteService } from '../../../shared/services/quote.service';
import { Quote } from '../../../shared/interfaces/quote.interface';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'quote-show-component',
  templateUrl: 'quote-show.html',
  moduleId: module.id
})
export class QuoteComponent {
  public quote: Observable<Quote>;
  constructor(private quoteService: QuoteService) {
    this.quote = this.quoteService.data;
  }
}
