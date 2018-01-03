import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { WindowRef } from '../../../shared/services/window-ref.service';
import { Order, AssetLineItem, Project, quotesWithoutPricing } from '../../../shared/interfaces/commerce.interface';
import { enhanceAsset } from '../../../shared/interfaces/enhanced-asset';
import { AppStore } from '../../../app.store';
import { Common } from '../../../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'order-show-component',
  templateUrl: 'order-show.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderShowComponent {
  public orderObservable: Observable<Order>;

  constructor(private window: WindowRef, private store: AppStore) {
    this.orderObservable = this.store.select(state => {
      const order: Order = Common.clone(state.order.activeOrder);

      order.projects.forEach((project: Project) => {
        if (!project.lineItems) return;

        project.lineItems.forEach((lineItem: AssetLineItem) => {
          lineItem.asset = enhanceAsset(
            Object.assign(lineItem.asset, { uuid: lineItem.id }),
            'orderAsset', order.id
          );
        });
      });

      return order;
    });
  }

  public downloadMaster(masterUrl: string): void {
    this.window.nativeWindow.location.href = masterUrl;
  }

  public assetCountLabelKeyFor(count: number): string {
    switch (count) {
      case 0: return 'ORDER.SHOW.PROJECTS.NO_ASSETS';
      case 1: return 'ORDER.SHOW.PROJECTS.ONLY_ONE_ASSET';
      default: return 'ORDER.SHOW.PROJECTS.MORE_THAN_ONE_ASSET';
    }
  }

  public isRefundedLineItem(lineItem: AssetLineItem): boolean {
    return lineItem.price < 0;
  }

  public isRefundedProject(project: Project): boolean {
    return !!project.creditMemoForProjectId;
  }

  public isRefundedOrder(order: Order): boolean {
    return !!order.creditMemoForOrderId;
  }

  public shouldShowPaymentBalanceFor(item: Order): boolean {
    return !!item.paymentDueDate && !!item.paymentBalance && item.paymentBalance > 0;
  }

  public shouldShowDiscountFor(order: Order): boolean {
    return (order.discount || 0) > 0 && !order.creditMemoForOrderId;
  }

  public offlineAgreementIdsFor(order: Order): string {
    let ids: string[] = [];
    order.projects.forEach(project => project.lineItems.forEach((lineItem: AssetLineItem) => {
      if (lineItem.externalAgreementIds) lineItem.externalAgreementIds.forEach(id => ids.push(id));
    }));
    return ids.filter((id: string, index: number, ids: string[]) => id !== ids[index - 1]).join(', ');
  }

  public shouldDisplayRights(lineItem: AssetLineItem, order: Order): boolean {
    return lineItem.rightsManaged === 'Rights Managed' && !quotesWithoutPricing.includes(order.orderType);
  }

  public showDownloadButtonFor(lineItem: AssetLineItem): boolean {
    return !!lineItem.asset.masterDownloadUrl;
  }

  public showAsperaButtonFor(lineItem: AssetLineItem): boolean {
    return lineItem.transcodeStatus === 'Completed' && !!lineItem.asperaSpec;
  }
}
