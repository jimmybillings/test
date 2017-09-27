import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AssetLineItem } from '../../../shared/interfaces/commerce.interface';
import { SelectedPriceAttributes } from '../../../shared/interfaces/common.interface';
@Component({
  moduleId: module.id,
  selector: 'line-item-rights-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:
  `
  <ng-container *ngIf="rightsManaged == 'Rights Managed'">
    <section [ngClass]="{'read-only': readOnly, 'needs-rights': !hasAttributes}" (click)="showPricingDialog.emit()">
      <ng-container *ngIf="!isOrder">
        <header>{{'QUOTE.RIGHTS_PACKAGE_TITLE' | translate}}</header>
        <span *ngIf="!hasAttributes" class="cart-asset-metadata md-caption">
          <strong>{{'QUOTE.RIGHTS_PACKAGE_NOT_SELECTED_MSG' | translate}}</strong>
        </span>
      </ng-container>
      <span *ngFor="let right of rights" class="cart-asset-metadata md-caption">
        <strong>{{right.priceAttributeName}}: </strong> {{right.selectedAttributeValue}}
      </span>
    </section>
  </ng-container>
  <ng-container *ngIf="rightsManaged == 'Royalty Free'">
    <section class="read-only">
      <header class="royalty-free">{{rightsManaged}}</header>
    </section>
  </ng-container>
  `
})
export class LineItemRightsComponent {
  @Input() rights: Array<SelectedPriceAttributes>;
  @Input() rightsManaged: string;
  @Input() hasAttributes: boolean;
  @Input() readOnly: boolean = false;
  @Input() isOrder: boolean = false;
  @Output() showPricingDialog: EventEmitter<null> = new EventEmitter();
}
