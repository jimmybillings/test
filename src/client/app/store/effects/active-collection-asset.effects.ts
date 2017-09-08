import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import * as ActiveCollectionAssetActions from '../actions/active-collection-asset.actions';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { Asset, ChildAssetLoadParameters } from '../../shared/interfaces/common.interface';
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
      return state.activeCollectionAsset.loadingUuid !== null;
    }).map(([action, state]: [ActiveCollectionActions.LoadSuccess, AppState]) => {
      const loadParameters: ChildAssetLoadParameters =
        this.createAssetLoadParametersFor(state.activeCollection.collection, state.activeCollectionAsset.loadingUuid);
      return this.store.create(factory => factory.activeCollectionAsset.loadAfterCollectionAvailable(loadParameters));
    });

  @Effect()
  public load: Observable<Action> = this.actions.ofType(ActiveCollectionAssetActions.Load.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection))
    .map(([action, collection]: [ActiveCollectionAssetActions.Load, Collection]) => {
      let mapper: InternalActionFactoryMapper;
      if (collection.id === null) {
        mapper = (factory) => factory.activeCollection.load();
      } else {
        const loadParameters: ChildAssetLoadParameters = this.createAssetLoadParametersFor(collection, action.assetUuid);
        mapper = (factory) => factory.activeCollectionAsset.loadAfterCollectionAvailable(loadParameters);
      }
      return this.store.create(mapper);
    });

  constructor(private actions: Actions, private store: AppStore, private service: AssetService) { }

  private createAssetLoadParametersFor(collection: Collection, assetUuid: string): ChildAssetLoadParameters {
    const asset: Asset = collection.assets.items.find(asset => asset.uuid === assetUuid);

    return {
      id: String(asset.assetId),
      uuid: String(asset.uuid),
      timeStart: String(asset.timeStart),
      timeEnd: String(asset.timeEnd)
    };
  }
}
