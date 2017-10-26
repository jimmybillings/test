import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Invoice } from '../../../shared/interfaces/commerce.interface';
import { AppStore } from '../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'order-invoice-component',
  templateUrl: 'order-invoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderInvoiceComponent {
  public invoice: Observable<Invoice>;

  constructor(private store: AppStore) {
    this.invoice = this.store.select(state => state.order.invoice);
  }
}
