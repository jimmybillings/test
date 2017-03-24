import { Component } from '@angular/core';
import { QuotesService } from '../../../shared/services/quotes.service';

@Component({
  selector: 'quotes-component',
  templateUrl: 'quotes.html',
  moduleId: module.id
})
export class QuotesComponent {
  constructor(private quotesService: QuotesService) {
    this.quotesService.data.subscribe((d: any) => console.log(d));
  }
}
