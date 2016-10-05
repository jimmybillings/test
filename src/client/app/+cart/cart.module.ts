import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { CartService } from './services/cart.service';
import { CartStore } from './services/cart.store';
import { CartComponent } from './cart.component';
import { ProjectsComponent } from './components/projects.component';
import { ProjectComponent } from './components/project.component';
import { LineItemsComponent } from './components/line-items.component';
import { AssetComponent } from './components/asset.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CartComponent,
    ProjectsComponent,
    ProjectComponent,
    LineItemsComponent,
    AssetComponent
  ],
  exports: [CartComponent],
  providers: [CartService, CartStore]
})

export class CartModule {}
