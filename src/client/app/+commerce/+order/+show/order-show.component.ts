import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  moduleId: module.id,
  selector: 'order-show-component',
  templateUrl: 'order-show.html'
})

export class OrderShowComponent {
  constructor(private order: OrderService) { }
  
  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  public downloadMaster(masterUrl: string): void {
    window.location.href = masterUrl;
  }
}
