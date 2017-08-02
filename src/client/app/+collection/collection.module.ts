import { NgModule } from '@angular/core';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { COLLECTION_ROUTES } from './collection.routes';
import { CollectionShowResolver } from '../+collection/services/collection-show.resolver';
import { CollectionGuard } from './services/collection-guard';
import { WzCollectionItemListComponent } from './components/wz.collection-item-list.component';
import { CollectionDeleteComponent } from './components/collection-delete.component';
import { CollectionComponent } from './collection.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(COLLECTION_ROUTES)],
  declarations: [
    CollectionComponent,
    CollectionsComponent,
    CollectionShowComponent,
    WzCollectionItemListComponent,
    CollectionDeleteComponent
  ],
  exports: [CollectionComponent, CollectionsComponent, CollectionShowComponent],
  providers: [CollectionShowResolver, CollectionGuard],
  entryComponents: [CollectionDeleteComponent]
})

export class CollectionModule { }
