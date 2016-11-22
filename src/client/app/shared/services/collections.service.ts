import { Injectable } from '@angular/core';
import { Collection, Collections } from '../../shared/interfaces/collection.interface';
import { Observable } from 'rxjs/Rx';
import { ActiveCollectionService } from './active-collection.service';
import { CollectionsStore } from '../stores/collections.store';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

@Injectable()
export class CollectionsService {
  private params: any;

  constructor(
    private store: CollectionsStore,
    private api: ApiService,
    private activeCollection: ActiveCollectionService
  ) {
    this.setSearchParams();
    this.syncActiveCollection();
  }

  public get data(): Observable<Collections> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  public load(params: any = {}, loading: boolean = false): Observable<any> {
    //TODO:  Do we really want to update this.params every time load() is called?
    this.params = Object.assign({}, this.params, params);

    return this.api.get(Api.Assets, `collectionSummary/search`, { parameters: this.params, loading: loading })
      .do(response => this.store.replaceAllCollectionsWith(response));
  }

  public create(collection: Collection): Observable<any> {
    return this.api.post(Api.Assets, 'collectionSummary', { body: collection })
      .do(response => this.store.add(response as Collection));
  }

  public update(collection: Collection): Observable<any> {
    return this.api.put(Api.Assets, `collectionSummary/${collection.id}`, { body: collection });
  }

  // We can execute the same steps regardless of where we are deleting from, or which collection we are deleting (focused, last, etc)
    // 1. delete the collection from the store
    // 2. load the new active collection
    // 3. load the new list of collections
  // Each of the load() functions update their respective stores.
  // Using flatMap, we return this.load() because we always end on the collection index page after deleting a collection
  public delete(collectionId: number): Observable<any> {
    this.store.deleteCollectionWith(collectionId);
    return this.api.delete(Api.Identities, `collection/${collectionId}`)
      .flatMap(_ => {
        return this.activeCollection.load().flatMap(_ => {
          return this.load();
        });
      });
  }

  public destroyAll(): void {
    this.store.deleteAllCollections();
    this.activeCollection.resetStore();
  }

  private syncActiveCollection() {
    this.activeCollection.data.subscribe((collection: Collection) => {
      if (this.state.items && this.state.items.length > 0) this.store.update(collection);
    });
  }

  private setSearchParams() {
    this.params = { q: '', accessLevel: 'all', s: '', d: '', i: 0, n: 200 };
  }
}
