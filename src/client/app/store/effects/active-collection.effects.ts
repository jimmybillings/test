import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { ActiveCollectionService } from '../services/active-collection.service';
import { AppStore, AppState } from '../../app.store';
import { Collection, CollectionItems } from '../../shared/interfaces/collection.interface';
import { Asset } from '../../shared/interfaces/common.interface';
import * as SubclipMarkersInterface from '../../shared/interfaces/subclip-markers.interface';
import { Frame } from 'wazee-frame-formatter';
import { UserPreferenceService } from '../../shared/services/user-preference.service';

@Injectable()
export class ActiveCollectionEffects {
  @Effect()
  public load: Observable<Action> = this.actions.ofType(ActiveCollectionActions.Load.Type)
    .switchMap((action: ActiveCollectionActions.Load) => this.service.load(action.pagination))
    .map((collection: Collection) => this.store.create(factory => factory.activeCollection.loadSuccess(collection)));

  @Effect()
  public set: Observable<Action> = this.actions.ofType(ActiveCollectionActions.Set.Type)
    .switchMap((action: ActiveCollectionActions.Set) => this.service.set(action.collectionId, action.pagination))
    .map((collection: Collection) => this.store.create(factory => factory.activeCollection.setSuccess(collection)));

  @Effect()
  public loadPage: Observable<Action> = this.actions.ofType(ActiveCollectionActions.LoadPage.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection.id))
    .switchMap(([action, collectionId]: [ActiveCollectionActions.LoadPage, number]) =>
      this.service.loadPage(collectionId, action.pagination)
    ).map((assets: CollectionItems) => this.store.create(factory => factory.activeCollection.loadPageSuccess(assets)));

  // TODO: After user preference service has been replaced, this will map to a user preference action instead of calling do().
  @Effect({ dispatch: false })
  public openTrayOnAddOrRemove: Observable<Action> =
  this.actions.ofType(ActiveCollectionActions.AddAsset.Type, ActiveCollectionActions.RemoveAsset.Type)
    .do(() => this.userPreferenceService.openCollectionTray());

  @Effect()
  public addAsset: Observable<Action> = this.actions.ofType(ActiveCollectionActions.AddAsset.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection))
    .switchMap(([action, collection]: [ActiveCollectionActions.AddAsset, Collection]) =>
      this.service.addAssetTo(collection, action.asset, action.markers)
    ).map((assets: CollectionItems) => this.store.create(factory => factory.activeCollection.addAssetSuccess(assets)));

  @Effect()
  public showSnackBarOnAddSuccess: Observable<Action> = this.actions.ofType(ActiveCollectionActions.AddAssetSuccess.Type)
    .switchMap(() => this.store.select(state => state.activeCollection.collection.name))
    .map((name: string) =>
      this.store.create(factory => factory.snackbar.display('COLLECTION.ADD_TO_COLLECTION_TOAST', { collectionName: name }))
    );

  @Effect({ dispatch: false })
  public maybeChangeAssetRouteOnAddSuccess: Observable<Action> =
  this.actions.ofType(ActiveCollectionActions.AddAssetSuccess.Type)
    .do(() => {
      if (!this.assetRouteActivated()) return;

      const state: AppState = this.store.completeSnapshot();
      const currentAsset: Asset = state.asset.activeAsset;
      const addedAsset: Asset = state.activeCollection.latestAddition.asset;
      if (currentAsset.assetId !== addedAsset.assetId) return;

      const addedMarkers: SubclipMarkersInterface.SubclipMarkers =
        SubclipMarkersInterface.deserialize(state.activeCollection.latestAddition.markers);
      let addedTimeStart: number = SubclipMarkersInterface.timeStartFrom(addedMarkers);
      let addedTimeEnd: number = SubclipMarkersInterface.timeEndFrom(addedMarkers);
      if (addedTimeEnd < 0) addedTimeEnd = undefined;
      if (addedTimeStart < 0) addedTimeStart = undefined;
      // ASSUMPTION: If the active collection happens to have two assets with the same id and markers the user just added,
      // the user doesn't care which one we give him (and we can't tell which one is right anyway).
      const newAsset: Asset =
        state.activeCollection.collection.assets.items.find(asset =>
          asset.assetId === addedAsset.assetId && asset.timeStart === addedTimeStart && asset.timeEnd === addedTimeEnd
        );

      this.activateAssetRouteFor(currentAsset.assetId, newAsset);
    });

  @Effect()
  public removeAsset: Observable<Action> = this.actions.ofType(ActiveCollectionActions.RemoveAsset.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection))
    .switchMap(([action, collection]: [ActiveCollectionActions.RemoveAsset, Collection]) =>
      this.service.removeAssetFrom(collection, action.asset)
    ).map((assets: CollectionItems) => this.store.create(factory => factory.activeCollection.removeAssetSuccess(assets)));

  @Effect()
  public showSnackBarOnRemoveSuccess: Observable<Action> = this.actions.ofType(ActiveCollectionActions.RemoveAssetSuccess.Type)
    .switchMap(() => this.store.select(state => state.activeCollection.collection.name))
    .map((name: string) =>
      this.store.create(factory => factory.snackbar.display('COLLECTION.REMOVE_FROM_COLLECTION_TOAST', { collectionName: name }))
    );

  @Effect({ dispatch: false })
  public maybeChangeAssetRouteOnRemoveSuccess: Observable<Action> =
  this.actions.ofType(ActiveCollectionActions.RemoveAssetSuccess.Type)
    .do(() => {
      if (!this.assetRouteActivated()) return;

      const state: AppState = this.store.completeSnapshot();
      const currentAsset: Asset = state.asset.activeAsset;
      const removedAsset: Asset = state.activeCollection.latestRemoval;
      if (currentAsset.assetId !== removedAsset.assetId || currentAsset.uuid !== removedAsset.uuid) return;

      const otherAsset: Asset =
        state.activeCollection.collection.assets.items.find(asset =>
          asset.assetId === currentAsset.assetId && asset.uuid !== currentAsset.uuid
        );

      this.activateAssetRouteFor(currentAsset.assetId, otherAsset);
    });

  @Effect()
  public updateAssetMarkers: Observable<Action> = this.actions.ofType(ActiveCollectionActions.UpdateAssetMarkers.Type)
    .withLatestFrom(this.store.select(state => state.activeCollection.collection))
    .switchMap(([action, collection]: [ActiveCollectionActions.UpdateAssetMarkers, Collection]) =>
      this.service.updateAssetMarkers(collection, action.asset, action.markers)
    ).map((assets: CollectionItems) => this.store.create(factory => factory.activeCollection.updateAssetMarkersSuccess(assets)));

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: ActiveCollectionService,
    private userPreferenceService: UserPreferenceService,  // For now, until we can directly map to user preference actions...
    private router: Router
  ) { }

  private assetRouteActivated(): boolean {
    // Hacky.  But one cannot inject ActivatedRoute here and get any meaningful information.
    // See https://github.com/ngrx/effects/issues/78#issuecomment-299108842
    return this.router.routerState.snapshot.url.startsWith('/asset');
  }

  private activateAssetRouteFor(currentAssetId: number, nextAsset: Asset) {
    this.router.navigate([`/asset/${currentAssetId}`, this.routerParametersFor(nextAsset)]);
  }

  private routerParametersFor(asset: Asset): object {
    let parameters = {};

    if (asset) {
      parameters = { ...parameters, uuid: asset.uuid };
      if (asset.timeStart >= 0) parameters = { ...parameters, timeStart: String(asset.timeStart) };
      if (asset.timeEnd >= 0) parameters = { ...parameters, timeEnd: String(asset.timeEnd) };
    }

    return parameters;
  }
}
