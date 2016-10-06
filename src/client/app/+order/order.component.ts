import { Component, OnInit } from '@angular/core';
import { OrderService } from './services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'order-component',
  templateUrl: 'order.html'
})

export class OrderComponent implements OnInit {
  public order: any;
  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.orderService.data.subscribe((data: any) => {
      console.log(data);
      this.order = data;
    });
    this.route.params.subscribe((params: any) => {
      this.orderService.getOrder(params['orderId']);
    });
  }
}
