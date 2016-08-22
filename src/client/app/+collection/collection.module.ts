import { NgModule } from '@angular/core';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { SharedModule } from '../shared/shared.module';

import { CollectionSortDdComponent } from './components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from './components/collections-filter-dd.component';
import { CollectionsSearchFormComponent } from './components/collections-search-form.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CollectionsComponent,
    CollectionShowComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    CollectionsSearchFormComponent],
  exports: [CollectionsComponent, CollectionShowComponent],
})

export class CollectionModule { }


