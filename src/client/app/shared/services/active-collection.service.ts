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
    return this.api.get(Api.Assets, 'collectionSummary/focused')
      .do(response => this.store.updateTo(response as Collection));
  }

  public set(collectionId: number, set: boolean = true): Observable<any> {
    return this.api.put(Api.Assets, `collectionSummary/setFocused/${collectionId}`, { loading: true })
      .do(response => { if (set) this.store.updateTo(response as Collection); });
  }

  public addAsset(collectionId: any, asset: any): Observable<any> {
    return this.api.post(
      Api.Identities,
      `collection/${collectionId}/addAssets`,
      { body: { list: [{ assetId: asset.assetId }] } }
    );
  }

  public removeAsset(collectionId: any, assetId: any, uuid: any): Observable<any> {
    return this.api.post(
      Api.Identities,
      `collection/${collectionId}/removeAssets`,
      { body: { list: [{ assetId: assetId, uuid: uuid }] } }
    ).do(response => this.store.remove(response['list'][0]));
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
  public updateActiveCollectionStore(collection: Collection): void {
    this.store.updateTo(collection);
  }

  // TODO: Outside world shouldn't need to call this.
  public addAssetToStore(asset: any): void {
    this.store.add(asset);
  }

  // TODO: Outside world shouldn't need to call this.
  public resetStore(): void {
    this.store.reset();
  }

  // TODO: Outside world shouldn't need to call this.
  public updateActiveCollectionAssets(assets: any): void {
    this.store.updateAssetsTo(assets);
  }

  public setSearchParams() {
    this.params = { 's': '', 'd': '', 'i': '0', 'n': '50' };
  }

  public mergeCollectionData(item: any, search: any) {
    item.thumbnail = search.items[0].thumbnail;
    item.assets.items = item.assets;
    item.assets.pagination = {};
    item.assets.pagination.totalCount = search.totalCount;
    return item;
  }

  public isActiveCollection(collectionId: number): boolean {
    return this.state.id === collectionId;
  }
}
