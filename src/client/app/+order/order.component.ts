import { Component, OnInit } from '@angular/core';
import { OrderService } from './services/order.service';

@Component({
  moduleId: module.id,
  selector: 'order-component',
  templateUrl: 'order.html'
})

export class OrderComponent implements OnInit {
  public order: any;
  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.data.subscribe((data: any) => this.order = data);
  }
}
