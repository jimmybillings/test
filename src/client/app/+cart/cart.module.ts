import { NgModule } from '@angular/core';
import { CartComponent } from './cart.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [CartComponent],
  exports: [CartComponent]
})

export class CartModule { }
