import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Invoice } from '../../../shared/interfaces/commerce.interface';
import { AppStore } from '../../../app.store';
import { Pojo } from '../../../shared/interfaces/common.interface';

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

  public hasProp(obj: Pojo, ...props: string[]): boolean {
    if (props.length > 0) {
      if (obj && obj.hasOwnProperty(props[0])) {
        if (obj[props[0]] === '' || obj[props[0]] === 0 || JSON.stringify(obj[props[0]]) === JSON.stringify({})) {
          return false;
        } else {
          const prop = props.shift();
          return this.hasProp(obj[prop], ...props);
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
