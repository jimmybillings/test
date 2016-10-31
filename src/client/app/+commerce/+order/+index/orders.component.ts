import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { UiConfig } from '../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'orders-component',
  templateUrl: 'orders.html'
})
export class OrdersComponent implements OnInit {
  public pageSize: string;

  constructor(
    public uiConfig: UiConfig,
    private orders: OrdersService) { }

  ngOnInit() {
    this.uiConfig.get('global').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
    // this.orders.setSearchParams();
  }
}
