import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as ActiveCollectionAssetActions from '../actions/active-collection-asset.actions';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { Asset, CollectionAssetApiLoadParameters, CollectionAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { AppStore, AppState, InternalActionFactoryMapper } from '../../app.store';
import { AssetService } from '../services/asset.service';
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
    .filter(([action, state]: [ActiveCollectionActions.LoadSuccess, AppState]) => {
      return state.activeCollectionAsset.loadParameters !== null;
    }).map(([action, state]: [ActiveCollectionActions.LoadSuccess, AppState]) => {
      const extraLoadParams: CollectionAssetApiLoadParameters =
        this.mergeAssetWithLoadParameters(state.activeCollection.collection, state.activeCollectionAsset.loadParameters);
      return this.store.create(factory => factory.activeCollectionAsset.loadAfterCollectionAvailable(extraLoadParams));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(ActiveCollectionAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection))
    .map(([action, collection]: [ActiveCollectionAssetActions.Load, Collection]) => {
      let mapper: InternalActionFactoryMapper;
      if (collection.id === null) {
        mapper = (factory) => factory.activeCollection.load();
      } else {
        const extraLoadParams: CollectionAssetApiLoadParameters =
          this.mergeAssetWithLoadParameters(collection, action.loadParameters);
        mapper = (factory) => factory.activeCollectionAsset.loadAfterCollectionAvailable(extraLoadParams);
      }
      return this.store.create(mapper);
    });

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: AssetService
  ) { }

  private mergeAssetWithLoadParameters(
    collection: Collection,
    loadParameters: CollectionAssetUrlLoadParameters
  ): CollectionAssetApiLoadParameters {
    const asset: Asset = collection.assets.items.find(asset => asset.uuid === loadParameters.uuid);

    return this.extraLoadParametersFrom(asset);
  }

  private extraLoadParametersFrom(asset: Asset): CollectionAssetApiLoadParameters {
    return {
      id: String(asset.assetId),
      uuid: String(asset.uuid),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
