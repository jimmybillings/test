import { Component } from '@angular/core';
import { OrderService } from './services/order.service';

@Component({
  moduleId: module.id,
  selector: 'order-component',
  templateUrl: 'order.html'
})

export class OrderComponent {
  constructor(private order: OrderService) { }

  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  public downloadMaster(assetId: number): void {
    console.log(assetId);
    // this.order.downloadMaster(assetId).take(1).subscribe((res) => {
    //   if (res.url && res.url !== '') {
    //     window.location.href = res.url;
    //   } else {
    //     console.log('no master');
    //   }
    // });
  }
}
