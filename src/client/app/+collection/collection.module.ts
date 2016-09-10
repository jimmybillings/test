import { NgModule } from '@angular/core';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { COLLECTION_ROUTES } from './collection.routes';
import { CollectionShowResolver } from '../+collection/services/collection-show.resolver';
import { CollectionGuard } from './services/collection-guard';
import { WzCollectionItemListComponent } from '../shared/components/wz-collection-item-list/wz.collection-item-list.component';
@NgModule({
  imports: [SharedModule, RouterModule.forChild(COLLECTION_ROUTES)],
  declarations: [
    CollectionsComponent,
    CollectionShowComponent,
    WzCollectionItemListComponent],
  exports: [CollectionsComponent, CollectionShowComponent],
  providers: [CollectionShowResolver, CollectionGuard]
})

export class CollectionModule { }
