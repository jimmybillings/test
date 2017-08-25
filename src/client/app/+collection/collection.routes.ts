import { Routes } from '@angular/router';
import { CollectionShowResolver } from './services/collection-show.resolver';
import { CollectionsComponent } from './+index/collections.component';
import { CollectionShowComponent } from './+show/collection-show.component';
import { CollectionGuard } from './services/collection-guard';
import { CollectionComponent } from './collection.component';
import { AssetComponent } from '../+asset/asset.component';
import { CollectionAssetResolver } from './services/collection-asset.resolver';

export const COLLECTION_ROUTES: Routes = [
  {
    path: 'collections', component: CollectionComponent,
    children: [
      {
        path: '',
        component: CollectionsComponent,
        canActivate: [CollectionGuard]
      },
      {
        path: ':id',
        component: CollectionShowComponent,
        canActivate: [CollectionGuard],
        resolve: { collection: CollectionShowResolver }
      },
      {
        path: ':id/asset/:uuid',
        component: AssetComponent,
        canActivate: [CollectionGuard],
        resolve: { asset: CollectionAssetResolver }
      },
    ]
  }
];


