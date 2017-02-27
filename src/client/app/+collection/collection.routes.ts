import { Routes } from '@angular/router';
import { CollectionShowResolver } from './services/collection-show.resolver';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { CollectionGuard } from './services/collection-guard';
import { CollectionComponent } from './collection.component';
import { AppResolver } from '../app.resolver';

export const COLLECTION_ROUTES: Routes = [
  {
    path: 'collections', component: CollectionComponent, resolve: [AppResolver],
    children: [
      {
        path: '',
        component: CollectionsComponent,
        canActivate: [CollectionGuard]
      },
      {
        path: 'collection/:id',
        component: CollectionShowComponent,
        canActivate: [CollectionGuard],
        resolve: { collection: CollectionShowResolver }
      },
    ]
  }
];


