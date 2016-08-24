import { Routes } from '@angular/router';
import { CollectionShowResolver } from './services/collection-show.resolver';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { CollectionGuard } from './services/collection-guard';

export const COLLECTION_ROUTES: Routes = [
  { path: 'collection', component: CollectionsComponent, canActivate: [CollectionGuard] },
  { path: 'collection/:id', component: CollectionShowComponent, resolve: {collection: CollectionShowResolver} },
];

