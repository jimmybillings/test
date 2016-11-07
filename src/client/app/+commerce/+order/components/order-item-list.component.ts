import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'order-item-list',
  templateUrl: 'order-item-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderItemListComponent {
  @Input() orders: any;
}
