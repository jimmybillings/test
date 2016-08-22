import { NgModule } from '@angular/core';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CollectionsComponent,
    CollectionShowComponent,
  ],
  exports: [CollectionsComponent, CollectionShowComponent]
})

export class CollectionModule { }
