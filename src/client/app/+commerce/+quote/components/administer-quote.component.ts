import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Cart } from '../../../shared/interfaces/commerce.interface';

@Component({
  moduleId: module.id,
  selector: 'administer-quote-component',
  template: `<div flex="100" layout="column" layout-gt-sm="row" layout-align="end end">
    <div class="create-quote-actions">
      <button
        md-button
        class="reject-quote is-outlined"
        color="warn"
        (click)="openDeleteDialog.emit()">
        {{ 'QUOTE.DELETE_BTN' | translate }}
      </button>
      <button
        [disabled]="!userCanProceed"
        md-raised-button class="checkout"
        (click)="openQuoteDialog.emit()">
        {{ 'QUOTE.CREATE_QUOTE_BTN' | translate }}
      </button>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministerQuoteComponent {
  @Input() cart: Cart;
  @Input() userCanProceed: boolean;
  @Output() saveAsDraft: EventEmitter<any> = new EventEmitter();
  @Output() openQuoteDialog: EventEmitter<any> = new EventEmitter();
  @Output() openDeleteDialog: EventEmitter<any> = new EventEmitter();
}
