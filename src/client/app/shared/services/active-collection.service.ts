import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ActiveCollectionStore } from '../stores/active-collection.store';
import { Collection } from '../interfaces/collection.interface';
import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';
import { SubclipMarkers } from '../interfaces/asset.interface';
import { Frame } from 'wazee-frame-formatter';

@Injectable()
export class ActiveCollectionService implements OnInit {
  public params: any;

  constructor(private store: ActiveCollectionStore, public api: ApiService) { }

  ngOnInit(): void {
    this.setSearchParams();
  }

  public get data(): Observable<Collection> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  // TODO: Outside world shouldn't need to call this.
  public resetStore(): void {
    this.store.reset();
  }

  public isActiveCollection(collectionId: number): boolean {
    return this.state.id === collectionId;
  }

  public collectionIncludes(uuid: string) {
    return this.state.assets.items.find((item: any) => uuid === item.uuid);
  }

  public load(collectionId?: number, params: any = { i: 0, n: 100 }): Observable<any> {
    if (!collectionId) {
      return this.api.get(Api.Assets, 'collectionSummary/focused', { loading: true })
        .flatMap((response: any) => {
          this.store.updateTo(response as Collection);
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
        { body: { list: [uuid] }, loading: true })
        .do(response => this.store.remove(response['list'][0]));
    } else {
      return Observable.of({});
    }
  }

  public updateAsset(id: any, asset: any, updatedMarkers: SubclipMarkers): Observable<any> {
    return this.api.put(
      Api.Identities,
      `collection/${id}/updateAsset`,
      {
        body: {
          uuid: asset.uuid,
          assetId: asset.assetId,
          timeStart: this.timeStartFrom(updatedMarkers),
          timeEnd: this.timeEndFrom(updatedMarkers)
        }
      }
    ).do(data => this.store.updateAsset(data));
  }

  public getItems(collectionId: number, collectionParams: any, set: boolean = true, loading: boolean = true): Observable<any> {
    if (collectionParams['i']) collectionParams['i'] -= 1;
    this.params = Object.assign({}, this.params, collectionParams);

    return this.api.get(
      Api.Assets,
      `collectionSummary/assets/${collectionId}`,
      { parameters: this.params, loading: loading }
    ).do(response => { if (set) { this.store.updateAssetsTo(response); } });
  }

  private set(collectionId: number, params?: any): Observable<any> {
    return Observable.forkJoin([
      this.api.put(Api.Assets, `collectionSummary/setFocused/${collectionId}`, { loading: true }),
      this.getItems(collectionId, params, false)
    ]).do((data: any) => {
      this.store.updateTo(data[0]);
      this.store.updateAssetsTo(data[1]);
    });
  }

  private setSearchParams() {
    this.params = { 's': '', 'd': '', 'i': '0', 'n': '50' };
  }

  private timeStartFrom(markers: SubclipMarkers): number {
    return markers && markers.in ? this.toMilliseconds(markers.in) : -1;
  }

  private timeEndFrom(markers: SubclipMarkers): number {
    return markers && markers.out ? this.toMilliseconds(markers.out) : -2;
  }

  private toMilliseconds(frame: Frame): number {
    return frame.asSeconds(3) * 1000;
  }
}
