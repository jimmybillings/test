import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Collection, CollectionItemsResponse, CollectionItemMarkersUpdater } from '../interfaces/collection.interface';
import { Asset } from '../interfaces/common.interface';
import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';
import { SubclipMarkers } from '../interfaces/asset.interface';
import { Frame } from 'wazee-frame-formatter';
import { State } from '../../app.store';
import * as ActiveCollectionActions from '../actions/active-collection.actions';

@Injectable()
export class ActiveCollectionService implements OnInit {
  public params: any;

  constructor(private store: Store<State>, public api: ApiService) { }

  ngOnInit(): void {
    this.setSearchParams();
  }

  public get data(): Observable<Collection> {
    return this.store.select(state => state.activeCollection);
  }

  public get state(): Collection {
    let state: Collection;
    this.data.take(1).subscribe(latestState => state = latestState);
    return state;
  }

  // TODO: Outside world shouldn't need to call this.
  public resetStore(): void {
    this.store.dispatch(new ActiveCollectionActions.Reset());
  }

  public isActiveCollection(collectionId: number): boolean {
    return this.state.id === collectionId;
  }

  public collectionIncludes(uuid: string) {
    return this.state.assets.items.find((item: Asset) => uuid === item.uuid);
  }

  public load(collectionId?: number, params: any = { i: 0, n: 100 }): Observable<any> {
    if (!collectionId) {
      return this.api.get(Api.Assets, 'collectionSummary/focused', { loadingIndicator: true })
        .flatMap((response: any) => {
          this.store.dispatch(new ActiveCollectionActions.UpdateSummary(response));
          return this.getItems(response.id, { i: 1, n: 100 });
        });
    } else {
      return this.set(collectionId, params);
    }
  }

  public addAsset(collectionId: any, asset: any, markers: SubclipMarkers = null): Observable<any> {
    const assetToAdd: object = {
      assetId: asset.assetId,
      timeStart: this.timeStartFrom(markers).toString(),
      timeEnd: this.timeEndFrom(markers).toString()
    };

    return this.api.post(
      Api.Identities,
      `collection/${collectionId}/addAssets`,
      { body: { list: [assetToAdd] } }
    ).flatMap((response: any) => {
      return this.getItems(collectionId, { i: 1, n: 100 });
    });
  }

  public removeAsset(params: any): Observable<any> {
    let collection: Collection = params.collection;
    let uuid: any, assetToBeRemoved: any;
    assetToBeRemoved = params.collection.assets.items.find((item: any) => {
      return parseInt(item.assetId) === parseInt(params.asset.assetId);
    });
    if (params.asset.uuid && assetToBeRemoved) {
      uuid = params.asset.uuid;
    } else {
      uuid = assetToBeRemoved ? assetToBeRemoved.uuid : false;
    }
    if (assetToBeRemoved && uuid) {
      return this.api.post(
        Api.Identities,
        `collection/${collection.id}/removeAssets`,
        { body: { list: [uuid] }, loadingIndicator: true })
        .do(response => this.store.dispatch(new ActiveCollectionActions.RemoveAsset(assetToBeRemoved)));
    } else {
      return Observable.of({});
    }
  }

  public updateAsset(id: any, asset: any, updatedMarkers: SubclipMarkers): Observable<any> {
    const updater: CollectionItemMarkersUpdater = {
      uuid: asset.uuid,
      assetId: asset.assetId,
      timeStart: this.timeStartFrom(updatedMarkers),
      timeEnd: this.timeEndFrom(updatedMarkers)
    };

    return this.api.put(Api.Identities, `collection/${id}/updateAsset`, { body: updater })
      .do(data => this.store.dispatch(new ActiveCollectionActions.UpdateAssetMarkers(updater)));
  }

  public getItems(collectionId: number, collectionParams: any, set: boolean = true, loadingIndicator: boolean = true): Observable<any> {
    if (collectionParams['i']) collectionParams['i'] -= 1;
    this.params = Object.assign({}, this.params, collectionParams);

    return this.api.get(
      Api.Assets,
      `collectionSummary/assets/${collectionId}`,
      { parameters: this.params, loadingIndicator: loadingIndicator }
    ).do(response => {
      if (set) { this.store.dispatch(new ActiveCollectionActions.UpdateAssets(response as CollectionItemsResponse)) }
    });
  }

  private set(collectionId: number, params?: any): Observable<any> {
    return Observable.forkJoin([
      this.api.put(Api.Assets, `collectionSummary/setFocused/${collectionId}`, { loadingIndicator: true }),
      this.getItems(collectionId, params, false)
    ]).do((data: any) => {
      this.store.dispatch(new ActiveCollectionActions.UpdateSummary(data[0]));
      this.store.dispatch(new ActiveCollectionActions.UpdateAssets(data[1]));
    });
  }

  private setSearchParams() {
    this.params = { 's': '', 'd': '', 'i': '0', 'n': '50' };
  }

  private timeStartFrom(markers: SubclipMarkers): string {
    return String(markers && markers.in ? this.toMilliseconds(markers.in) : -1);
  }

  private timeEndFrom(markers: SubclipMarkers): string {
    return String(markers && markers.out ? this.toMilliseconds(markers.out) : -2);
  }

  private toMilliseconds(frame: Frame): number {
    return frame.asSeconds(3) * 1000;
  }
}
