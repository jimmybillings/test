import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MdSelectChange } from '@angular/material';
import { MdSelectOption } from '../../../shared/interfaces/forms.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-purchase-type-component',
  template: `
    <div class="quote-purchase-types" layout="row" layout-align="start center">
      <md-select 
        (change)="onSelectChange($event)" 
        [(ngModel)]="selectedType" 
        placeholder="{{ 'QUOTE.PURCHASE_TYPE_SELECT' | translate }}">
        <md-option
          *ngFor="let type of types"
          [value]="type.value">{{ type.viewValue }}
        </md-option>
      </md-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `md-select { width: 200px; margin-top: 11px; margin-bottom: 11px; }`,
    `.quote-purchase-types { padding: 12px 5px 0 5px; }`,
    `:host { margin-bottom: -38px; min-width: 284px; }`
  ]
})
export class QuotePurchaseTypeComponent {
  public types: MdSelectOption[];
  public selectedType: string;
  @Output() selectQuoteType: EventEmitter<{ type: string }> = new EventEmitter();
  @Input()
  public set quoteTypes(types: MdSelectOption[]) {
    this.types = types;
    this.selectedType = this.types[0].value;
  }

  public onSelectChange(event: MdSelectChange): void {
    this.selectQuoteType.emit({ type: event.value });
  }
}
