import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart.component';
import { ProjectsComponent } from './components/projects.component';
import { ProjectComponent } from './components/project.component';
import { CartService } from './services/cart.service';

@NgModule({
  imports: [SharedModule],
  declarations: [CartComponent, ProjectsComponent, ProjectComponent],
  exports: [CartComponent],
  providers: [CartService]
})

export class CartModule {}
