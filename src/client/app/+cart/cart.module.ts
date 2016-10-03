import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart.component';
import { ProjectsComponent } from './components/projects.component';
import { ProjectComponent } from './components/project.component';
import { CartService } from './services/cart.service';
import { CartStore } from './services/cart.store';

@NgModule({
  imports: [SharedModule],
  declarations: [CartComponent, ProjectsComponent, ProjectComponent],
  exports: [CartComponent],
  providers: [CartService, CartStore]
})

export class CartModule {}
