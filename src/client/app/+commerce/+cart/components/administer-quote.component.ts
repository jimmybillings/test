import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Cart, Project, LineItem } from '../../../shared/interfaces/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'administer-quote-component',
  template: `<div flex="100" layout="column" layout-gt-sm="row" layout-align="end end">
    <div class="create-quote-actions">
      <button
        [disabled]="!userCanProceed"
        md-button 
        color="primary"
        class="is-outlined"
        (click)="saveAsDraft.emit()">
        {{ 'QUOTE.SAVE_AS_DRAFT_BTN' | translate }}
      </button>
      <button
        [disabled]="!userCanProceed"
        md-raised-button class="checkout"
        (click)="openQuoteDialog.emit()">
        {{ 'QUOTE.CREATE_QUOTE_BTN' | translate }}
      </button>
    </div>
  </div>`,
  styles: [
    `button.is-outlined { line-height: 48px; }`,
    `button.checkout { margin-left: 2px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministerQuoteComponent {
  @Input() cart: Cart;
  @Input() userCanProceed: boolean;
  @Output() saveAsDraft: EventEmitter<any> = new EventEmitter();
  @Output() openQuoteDialog: EventEmitter<any> = new EventEmitter();
}
