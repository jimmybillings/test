import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AssetLineItem } from '../../../shared/interfaces/commerce.interface';
import { SelectedPriceAttributes } from '../../../shared/interfaces/common.interface';
@Component({
  moduleId: module.id,
  selector: 'line-item-rights-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:
  `<section [ngClass]="{'read-only': readOnly, 'needs-rights': !hasAttributes}" (click)="showPricingDialog.emit()">
    <header>{{'QUOTE.RIGHTS_PACKAGE_TITLE' | translate}}</header>
    <span *ngIf="!hasAttributes" class="cart-asset-metadata md-caption">
      <strong>{{'QUOTE.RIGHTS_PACKAGE_NOT_SELECTED_MSG' | translate}}</strong>
    </span>
    <span *ngFor="let right of rights" class="cart-asset-metadata md-caption">
      <strong>{{right.priceAttributeName}}: </strong> {{right.selectedAttributeValue}}
    </span>
  </section>`
})
export class LineItemRightsComponent {
  @Input() rights: Array<SelectedPriceAttributes>;
  @Input() hasAttributes: boolean;
  @Input() readOnly: boolean = false;
  @Output() showPricingDialog: EventEmitter<null> = new EventEmitter();
}
