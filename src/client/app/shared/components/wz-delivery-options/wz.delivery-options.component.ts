import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppStore } from '../../../app.store';
import { DeliveryOption, DeliveryOptions, DeliveryOptionGroup } from '../../../shared/interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-delivery-options',
  templateUrl: './wz.delivery-options.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzDeliveryOptionsComponent implements OnInit {
  public deliveryOptions: Observable<DeliveryOptions>;
  public hasDeliveryOptions: Observable<boolean>;
  public showLoadingSpinner: Observable<boolean>;

  constructor(private store: AppStore) { }

  ngOnInit(): void {
    this.deliveryOptions = this.store.select(state => state.deliveryOptions.options);
    this.hasDeliveryOptions = this.store.select(state => state.deliveryOptions.hasDeliveryOptions);
    this.showLoadingSpinner = this.store.select(state => state.deliveryOptions.loading);
  }

  public iconStringFor(option: DeliveryOption): string {
    return `ASSET.DELIVERY_OPTIONS.ICON.${option.deliveryOptionTransferType}`;
  }

  public trStringFor(group: DeliveryOptionGroup): string {
    return `ASSET.DELIVERY_OPTIONS.LABEL.${group[0].deliveryOptionLabel}`;
  }
}
