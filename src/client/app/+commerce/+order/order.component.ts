import { Component } from '@angular/core';
import { OrderService } from './services/order.service';

@Component({
  moduleId: module.id,
  selector: 'order-component',
  templateUrl: 'order.html'
})

export class OrderComponent {
  constructor(private order: OrderService) {}
}
