import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Cart, Project, LineItem } from '../../../shared/interfaces/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'administer-quote-component',
  templateUrl: './administer-quote.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `.quote-purchase-types { padding: 20px; }`
  ]
})
export class AdministerQuoteComponent {
  @Input() cart: Cart;
  @Output() saveAsDraft: EventEmitter<any> = new EventEmitter();
  @Output() openQuoteDialog: EventEmitter<any> = new EventEmitter();
  @Output() selectQuoteType: EventEmitter<any> = new EventEmitter();
  public types: any[] = [
    { viewValue: 'Standard', value: 'standard' },
    { viewValue: 'Provisional Order', value: 'provisionalOrder' },
    { viewValue: 'Offline Agreement', value: 'offlineAgreement' }
  ];
  public selectedType: string = this.types[0].value;

  public get rmAssetsHaveAttributes(): boolean {
    if (this.cart.itemCount === 0) return true;

    let validAssets: boolean[] = [];

    this.cart.projects.forEach((project: Project) => {
      if (project.lineItems) {
        project.lineItems.forEach((lineItem: LineItem) => {
          validAssets.push(lineItem.rightsManaged === 'Rights Managed' ? !!lineItem.attributes : true);
        });
      }
    });

    return validAssets.indexOf(false) === -1;
  }
}
