import { Component } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { Observable } from 'rxjs/Observable';
import { Order, AssetLineItem, Project } from '../../../shared/interfaces/commerce.interface';

@Component({
  moduleId: module.id,
  selector: 'order-show-component',
  templateUrl: 'order-show.html'
})

export class OrderShowComponent {
  constructor(public window: WindowRef, public order: OrderService) { }

  public downloadMaster(masterUrl: string): void {
    this.window.nativeWindow.location.href = masterUrl;
  }

  public displayOrderAssetCount(count: number): string {
    if (count > 0) {
      return (count === 1) ? 'ORDER.SHOW.PROJECTS.ONLY_ONE_ASSET' : 'ORDER.SHOW.PROJECTS.MORE_THAN_ONE_ASSET';
    } else return 'ORDER.SHOW.PROJECTS.NO_ASSETS';
  }

  public isRefundedLineItem(lineItem: AssetLineItem): boolean {
    return lineItem.price < 0;
  }

  public isRefundedProject(project: Project): boolean {
    return !!project.creditMemoForProjectId;
  }

  public get isRefund(): Observable<boolean> {
    return this.order.data.map((order: Order) => !!order.creditMemoForOrderId);
  }

  public get creditMemoForOrderId(): Observable<number> {
    return this.order.data.map((order: Order) => order.creditMemoForOrderId);
  }
}
