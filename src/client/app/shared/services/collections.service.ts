import { Injectable } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { Observable } from 'rxjs/Observable';
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

  public get data(): Observable<Collection[]> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  public load(params?: any, loadingIndicator: boolean = false): Observable<any> {
    if (params) this.params = Object.assign({}, this.params, params);

    return this.api.get(Api.Assets, `collectionSummary/search`, { parameters: this.params, loadingIndicator: loadingIndicator })
      .do(response => this.store.replaceAllCollectionsWith(response));
  }

  public create(collection: Collection): Observable<any> {
    return this.api.post(Api.Assets, 'collectionSummary', { body: collection })
      .do(response => this.store.add(response as Collection));
  }

  public update(collection: Collection): Observable<any> {
    return this.api.put(Api.Assets, `collectionSummary/${collection.id}`, { body: collection });
  }

  public delete(collectionId: number): Observable<any> {
    this.store.deleteCollectionWith(collectionId);
    return this.api.delete(Api.Identities, `collection/${collectionId}`)
      .flatMap(_ => {
        if (this.activeCollection.isActiveCollection(collectionId)) {
          return this.activeCollection.load().flatMap(_ => {
            return this.load();
          });
        } else {
          return this.load();
        }
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
