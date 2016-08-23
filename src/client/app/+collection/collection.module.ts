import { NgModule } from '@angular/core';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CollectionSortDdComponent } from './components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from './components/collections-filter-dd.component';
import { CollectionsSearchFormComponent } from './components/collections-search-form.component';
import { COLLECTION_ROUTES } from './collection.routes';
import { CollectionShowResolver } from '../+collection/services/collection-show.resolver';
import { CollectionGuard } from './services/collection-guard';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(COLLECTION_ROUTES)],
  declarations: [
    CollectionsComponent,
    CollectionShowComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    CollectionsSearchFormComponent],
  exports: [CollectionsComponent, CollectionShowComponent],
  providers: [CollectionShowResolver, CollectionGuard]
})

export class CollectionModule { }


