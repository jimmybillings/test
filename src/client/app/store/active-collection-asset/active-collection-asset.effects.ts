import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as ActiveCollectionAssetActions from './active-collection-asset.actions';
import * as ActiveCollectionActions from '../active-collection/active-collection.actions';
import { Asset } from '../../shared/interfaces/common.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../asset/asset.service';
import { Collection } from '../../shared/interfaces/collection.interface';

@Injectable()
export class ActiveCollectionAssetEffects {
  @Effect()
  public loadAfterCollectionAvailable: Observable<Action> =
  this.actions.ofType(ActiveCollectionAssetActions.LoadAfterCollectionAvailable.Type)
    .switchMap((action: ActiveCollectionAssetActions.LoadAfterCollectionAvailable) =>
      this.service.load(action.loadParameters)
        .map((asset: Asset) => this.store.create(factory => factory.activeCollectionAsset.loadSuccess(asset)))
        .catch(error => Observable.of(this.store.create(factory => factory.activeCollectionAsset.loadFailure(error))))
    );

  @Effect()
  public loadAssetOnCollectionLoadSuccess: Observable<Action> = this.actions.ofType(ActiveCollectionActions.LoadSuccess.Type)
    .withLatestFrom(this.store.select(state => state))
    .filter(([action, state]: [ActiveCollectionActions.LoadSuccess, AppState]) => !!state.activeCollectionAsset.loadingUuid)
    .map(([action, state]: [ActiveCollectionActions.LoadSuccess, AppState]) =>
      this.createNextActionFor(state.activeCollection.collection, state.activeCollectionAsset.loadingUuid)
    );

  @Effect()
  public load: Observable<Action> = this.actions.ofType(ActiveCollectionAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection))
    .map(([action, collection]: [ActiveCollectionAssetActions.Load, Collection]) =>
      this.createNextActionFor(collection, action.assetUuid)
    );

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createNextActionFor(collection: Collection, assetUuid: string): Action {
    return this.store.create(this.nextActionMapperFor(collection, assetUuid));
  }

  private nextActionMapperFor(collection: Collection, assetUuid: string): InternalActionFactoryMapper {
    if (collection.id === null) return factory => factory.activeCollection.load();

    const asset: Asset = collection.assets.items.find(asset => asset.uuid === assetUuid);

    if (asset) return factory => factory.activeCollectionAsset.loadAfterCollectionAvailable({
      id: String(asset.assetId), uuid: assetUuid, timeStart: String(asset.timeStart), timeEnd: String(asset.timeEnd)
    });

    return factory => factory.activeCollectionAsset.loadFailure({ status: 404 });
  }
}
