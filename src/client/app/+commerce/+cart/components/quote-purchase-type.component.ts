import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
// import { Cart, Project, LineItem } from '../../../shared/interfaces/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-purchase-type-component',
  template: `
    <div class="quote-purchase-types" layout="column" layout-align="start center">
      <md-select [(ngModel)]="selectedType" placeholder="Please select a quote purchase type">
        <md-option
          *ngFor="let type of types"
          [value]="type.value"
          (onSelect)="selectQuoteType.emit({ type: type.value });">{{ type.viewValue }}
        </md-option>
      </md-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `md-select { width: 100%; margin-top: 11px; margin-bottom: 11px; }`,
    `.quote-purchase-types { padding-top: 12px; padding-left: 2px; }`,
    `:host {margin-bottom: -37px}`
  ]
})
export class QuotePurchaseTypeComponent {
  // @Input() cart: Cart;
  @Output() selectQuoteType: EventEmitter<any> = new EventEmitter();
  public types: any[] = [
    { viewValue: 'Standard', value: 'standard' },
    { viewValue: 'Provisional Order', value: 'ProvisionalOrder' },
    { viewValue: 'Offline Agreement', value: 'OfflineAgreement' }
  ];
  public selectedType: string = this.types[0].value;
}
