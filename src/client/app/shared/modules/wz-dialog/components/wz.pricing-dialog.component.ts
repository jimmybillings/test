import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'wz-pricing-dialog',
  template: `
    <div class="wz-dialog">
      <button md-icon-button md-dialog-close title="Close" type="button" class="close">
        <md-icon>close</md-icon>
      </button>
      <h1 *ngIf="title" md-dialog-title>{{ title | translate }}</h1>
      <md-dialog-content layout="row">
        <wz-pricing 
          [attributes]="attributes"
          [usagePrice]="usagePrice"
          [pricingPreferences]="pricingPreferences"
          (pricingEvent)="onPricingEvent($event)"></wz-pricing>
      </md-dialog-content>
    </div>
  `
})

export class WzPricingDialogComponent implements OnChanges {
  @Input() title: string;
  @Input() attributes: Array<any>;
  @Input() dialog: any;
  @Input() usagePrice: Observable<any>;
  @Input() pricingPreferences: any;
  @Output() pricingEvent = new EventEmitter();

  public onPricingEvent(message: any) {
    this.pricingEvent.emit(message);
  }

  ngOnChanges(changes: any) {
    console.log(changes);
  }
}
