import { Component } from '@angular/core';
import { QuoteService } from '../../../shared/services/quote.service';

@Component({
  selector: 'quote-component',
  templateUrl: 'quote.html',
  moduleId: module.id
})
export class QuoteComponent {
  constructor(private quoteService: QuoteService) {
    this.quoteService.data.subscribe((d: any) => console.log(d));
  }
}
