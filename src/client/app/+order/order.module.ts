import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { OrderComponent } from './order.component';
import { OrderService } from './services/order.service';

@NgModule({
  imports: [SharedModule],
  declarations: [
    OrderComponent
  ],
  exports: [OrderComponent],
  providers: [OrderService]
})

export class OrderModule {}
