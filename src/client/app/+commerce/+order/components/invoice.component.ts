import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Invoice, Project, AssetLineItem } from '../../../shared/interfaces/commerce.interface';
import { enhanceAsset } from '../../../shared/interfaces/enhanced-asset';

import { AppStore } from '../../../app.store';
import { Pojo } from '../../../shared/interfaces/common.interface';
import { Common } from '../../../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'invoice-component',
  templateUrl: 'invoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})



export class InvoiceComponent {
  public isShared: Observable<boolean>;
  public invoiceObservable: Observable<Invoice>;

  constructor(private store: AppStore, private route: ActivatedRoute) {
    this.isShared = this.route.params.map(params => !!params['share_key']);

    this.invoiceObservable = this.store.select(state => {
      const invoice: Invoice = Common.clone(state.invoice.invoice);

      invoice.order.projects.forEach((project: Project) => {
        if (!project.lineItems) return;
        project.lineItems.forEach((lineItem: AssetLineItem) => {
          lineItem.asset = enhanceAsset(
            Object.assign(lineItem.asset, { uuid: lineItem.id }), 'orderAsset', invoice.order.id
          );
        });
      });
      return invoice;
    });






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
