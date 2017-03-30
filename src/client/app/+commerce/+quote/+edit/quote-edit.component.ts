import { Component } from '@angular/core';
import { QuotesService } from '../../../shared/services/quotes.service';

@Component({
  selector: 'quote-edit-component',
  templateUrl: 'quote-edit.html',
  moduleId: module.id
})
export class QuoteEditComponent {
  constructor(private quotesService: QuotesService) {
    this.quotesService.data.subscribe((d: any) => console.log(d));
  }
}
