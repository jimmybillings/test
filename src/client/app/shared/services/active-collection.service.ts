import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ActiveCollectionStore } from '../stores/active-collection.store';
import { Collection } from '../interfaces/collection.interface';
import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';

@Injectable()
export class ActiveCollectionService implements OnInit {
  public params: any;

  constructor(private store: ActiveCollectionStore, public api: ApiService) { }

  public get data(): Observable<Collection> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  ngOnInit(): void {
    this.setSearchParams();
  }

  public get(): Observable<any> {
    return this.api.get(Api.Assets, 'collectionSummary/focused', { loading: true })
      .flatMap((response: any) => {
        this.store.updateTo(response as Collection);
        return this.getItems(response.id, { i: 1, n: 100 }, true, true);
      });
  }

  public set(collectionId: number,params: any = { i: 0, n: 100 }): Observable<any> {
    return Observable.forkJoin([
      this.api.put(Api.Assets, `collectionSummary/setFocused/${collectionId}`, { loading: true }),
      this.getItems(collectionId, params, false)
    ]).do((data: any) => {
      this.store.updateTo(data[0]);
      this.store.updateAssetsTo(data[1]);
    });
  }

  public addAsset(collectionId: any, asset: any): Observable<any> {
    return this.api.post(
      Api.Identities,
      `collection/${collectionId}/addAssets`,
      { body: { list: [{ assetId: asset.assetId }] } }
    ).flatMap((response: any) => {
      return this.getItems(collectionId, { i: 1, n: 100 }, true);
    });
  }

  public removeAsset(params: any): Observable<any> {
    let collection: Collection = params.collection;
    let uuid: any = params.collection.assets.items.find((item: any) => item.assetId === params.asset.assetId).uuid;
    if (uuid && params.asset.assetId) {
      return this.api.post(
        Api.Identities,
        `collection/${collection.id}/removeAssets`,
        { body: { list: [{ assetId: params.asset.assetId, uuid: uuid }] } }
      ).do(response => this.store.remove(response['list'][0]));
    } else {
      return Observable.of({});
    }
  }

  public getItems(collectionId: number, collectionParams: any, set: boolean = true, loading: boolean = true): Observable<any> {
    if (collectionParams['i']) collectionParams['i'] -= 1;
    this.params = Object.assign({}, this.params, collectionParams);

    return this.api.get(
      Api.Assets,
      `collectionSummary/assets/${collectionId}`,
      { parameters: this.params, loading: loading }
    ).do(response => { if (set) this.store.updateAssetsTo(response); });
  }

  // TODO: Outside world shouldn't need to call this.
  public addAssetToStore(asset: any): void {
    this.store.add(asset);
  }

  // TODO: Outside world shouldn't need to call this.
  public resetStore(): void {
    this.store.reset();
  }

  public setSearchParams() {
    this.params = { 's': '', 'd': '', 'i': '0', 'n': '50' };
  }

  public isActiveCollection(collectionId: number): boolean {
    return this.state.id === collectionId;
  }
}
