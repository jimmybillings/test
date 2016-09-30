import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart.component';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CartComponent, ProjectsComponent, ProjectComponent],
  exports: [CartComponent]
})

export class CartModule {}
