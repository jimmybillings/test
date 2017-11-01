import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Invoice } from '../../../shared/interfaces/commerce.interface';
import { AppStore } from '../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'invoice-component',
  templateUrl: 'invoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoiceComponent {
  public invoice: Observable<Invoice>;

  constructor(private store: AppStore) {
    this.invoice = this.store.select(state => state.invoice.invoice);
  }

}
