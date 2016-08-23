import { Routes } from '@angular/router';
import { CollectionShowResolver } from './services/collection-show.resolver';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';

export const COLLECTION_ROUTES: Routes = [
  { path: 'collection', component: CollectionsComponent },
  { path: 'collection/:id', component: CollectionShowComponent, resolve: {collection: CollectionShowResolver} },
];

