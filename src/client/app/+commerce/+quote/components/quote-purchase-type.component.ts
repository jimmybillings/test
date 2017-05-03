import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'quote-purchase-type-component',
  template: `
    <div class="quote-purchase-types" layout="column" layout-align="start center">
      <md-select 
        (change)="selectQuoteType.emit({ type: $event.value });" 
        [(ngModel)]="selectedType" 
        placeholder="Please select a quote purchase type">
        <md-option
          *ngFor="let type of types"
          [value]="type.value">{{ type.viewValue }}
        </md-option>
      </md-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `md-select { width: 100%; margin-top: 11px; margin-bottom: 11px; }`,
    `.quote-purchase-types { padding: 12px 5px 0 5px; }`,
    `:host {margin-bottom: -38px; min-width: 284px;}`
  ]
})
export class QuotePurchaseTypeComponent {
  @Output() selectQuoteType: EventEmitter<any> = new EventEmitter();
  public types: any[] = [
    { viewValue: 'Standard', value: 'standard' },
    { viewValue: 'Provisional Order', value: 'ProvisionalOrder' },
    { viewValue: 'Offline Agreement', value: 'OfflineAgreement' }
  ];
  public selectedType: string = this.types[0].value;
}
