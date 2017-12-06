import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public isShared: Observable<boolean>;
  public invoice: Observable<Invoice>;

  constructor(private store: AppStore, private route: ActivatedRoute) {
    this.invoice = this.store.select(state => state.invoice.invoice);
    this.isShared = this.route.params.map(params => !!params['share_key']);
  }
}
