import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart.component';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project.component';
// TODO: Move '../shared/services/cart.service' to ./+cart/services
// and change the path to this file
// import { CartService, cart } from '../services/cart.service';
import { CartService } from '../shared/services/cart.service';

@NgModule({
  imports: [SharedModule],
  declarations: [CartComponent, ProjectsComponent, ProjectComponent],
  exports: [CartComponent],
  providers: [CartService]
})

export class CartModule {}
