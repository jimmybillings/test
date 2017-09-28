import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Collection, CollectionActionType, CollectionSummary, CollectionSummaryItem } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../shared/services/collections.service';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { WzEvent, Pojo } from '../../shared/interfaces/common.interface';
import { UiConfig } from '../../shared/services/ui.config';
import { Subscription } from 'rxjs/Subscription';
import { CollectionContextService } from '../../shared/services/collection-context.service';
import { UiState } from '../../shared/services/ui.state';
import { CollectionLinkComponent } from '../components/collection-link.component';
import { CollectionFormComponent } from '../../application/collection-tray/components/collection-form.component';
import { CollectionDeleteComponent } from '../components/collection-delete.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AppStore } from '../../app.store';
import { Common } from '../../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'collections-component',
  templateUrl: 'collections.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionsComponent {
  public collectionSearchIsShowing: boolean = false;
  public filterOptions: Array<any> = [];
  public sortOptions: Array<any> = [];

  constructor(
    public router: Router,
    public collections: CollectionsService,
    public collectionContext: CollectionContextService,
    public currentUser: CurrentUserService,
    public uiConfig: UiConfig,
    public uiState: UiState,
    private dialogService: WzDialogService,
    private store: AppStore) {
    this.filterOptions = [
      {
        'first': {
          'id': 0, 'name': 'COLLECTION.INDEX.FILTER_DD_MENU.ALL', 'value': 'all',
          'access': { 'accessLevel': 'all' }
        },
        'second': {
          'id': 1, 'name': 'COLLECTION.INDEX.FILTER_DD_MENU.OWNER',
          'value': 'owner',
          'access': { 'accessLevel': 'owner' }
        }
      },
      {
        'first': {
          'id': 2, 'name': 'COLLECTION.INDEX.FILTER_DD_MENU.EDITOR',
          'value': 'editor',
          'access': { 'accessLevel': 'editor' }
        },
        'second': {
          'id': 3, 'name':
          'COLLECTION.INDEX.FILTER_DD_MENU.VIEWER',
          'value': 'viewer',
          'access': { 'accessLevel': 'viewer' }
        }
      },
      {
        'first': {
          'id': 4,
          'name': 'COLLECTION.INDEX.FILTER_DD_MENU.RESEARCHER',
          'value': 'researcher',
          'access': { 'accessLevel': 'researcher' }
        }
      }
    ];
    this.sortOptions = [
      {
        'first': {
          'id': 0,
          'name': 'COLLECTION.INDEX.SORT_DD_MENU.DATE_MOD_NEWEST',
          'value': 'modNewest',
          'sort': { 's': 'lastUpdated', 'd': true }
        },
        'second': {
          'id': 1,
          'name': 'COLLECTION.INDEX.SORT_DD_MENU.DATE_MOD_OLDEST',
          'value': 'modOldest',
          'sort': {
            's': 'lastUpdated', 'd': false
          }
        }
      },
      {
        'first': {
          'id': 2,
          'name': 'COLLECTION.INDEX.SORT_DD_MENU.DATE_CREATE_NEWEST',
          'value': 'createNewest',
          'sort': {
            's': 'createdOn', 'd': true
          }
        },
        'second': {
          'id': 3,
          'name': 'COLLECTION.INDEX.SORT_DD_MENU.DATE_CREATE_OLDEST',
          'value': 'createOldest',
          'sort': { 's': 'createdOn', 'd': false }
        }
      },
      {
        'first': {
          'id': 4,
          'name': 'COLLECTION.INDEX.SORT_DD_MENU.LIST_COLL_ASC',
          'value': 'alphaAsc',
          'sort': { 's': 'name', 'd': false }
        },
        'second': {
          'id': 5,
          'name': 'COLLECTION.INDEX.SORT_DD_MENU.LIST_COLL_DESC',
          'value': 'alphaDesc',
          'sort': { 's': 'name', 'd': true }
        }
      }
    ];
  }

  public get collectionContextData() {
    return this.collectionContext.data;
  }

  public get activeCollection(): Observable<Collection> {
    return this.store.select(state => state.activeCollection.collection);
  }

  public toggleCollectionSearch() {
    this.collectionSearchIsShowing = !this.collectionSearchIsShowing;
  }

  public selectActiveCollection(id: number): void {
    this.store.dispatch(factory => factory.activeCollection.set(id));
  }

  public setCollectionForDelete(collection: CollectionSummaryItem): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: CollectionDeleteComponent,
        dialogConfig: { position: { top: '14%' } },
        inputOptions: {
          collection: Common.clone(collection),
        },
        outputOptions: [{
          event: 'deleteEvent',
          callback: (event: WzEvent) => this.deleteCollection(event.payload),
          closeOnEvent: true
        }]
      }
    );
  }

  public deleteCollection(id: number): void {
    this.collections.delete(id).subscribe();
  }

  public search(query: string) {
    this.collectionContext.updateCollectionOptions({ currentSearchQuery: query });
    this.collections.load(query, true).subscribe();
  }

  public onFilterCollections(filter: Pojo) {
    this.collectionContext.updateCollectionOptions({ currentFilter: filter });
    this.collections.load(filter.access, true).subscribe();
  }

  public onSortCollections(sort: Pojo) {
    this.collectionContext.updateCollectionOptions({ currentSort: sort });
    this.collections.load(sort.sort, true).subscribe();
  }

  public isActiveCollection(collectionId: number): boolean {
    return this.store.match(collectionId, state => state.activeCollection.collection.id);
  }

  public getAssetsForLink(collectionId: number): void {
    this.collections.getItems(collectionId).subscribe(data => {
      this.dialogService.openComponentInDialog(
        {
          componentType: CollectionLinkComponent,
          inputOptions: { assets: data.items }
        }
      );
    });
  }

  public editCollection(collection: CollectionSummaryItem) {
    this.dialogService.openComponentInDialog(
      this.collectionFormComponentOptions('edit', Common.clone(collection))
    );
  }

  public createCollection() {
    this.dialogService.openComponentInDialog(
      this.collectionFormComponentOptions('create')
    );
  }

  public onDuplicateCollection(collectionId: number) {
    this.collections.getByIdAndDuplicate(collectionId)
      .subscribe(collection => {
        this.dialogService.openComponentInDialog(
          this.collectionFormComponentOptions('duplicate', collection)
        );
      });
  }

  private collectionFormComponentOptions(actionType: CollectionActionType, collection: Pojo | boolean = false) {
    return {
      componentType: CollectionFormComponent,
      inputOptions: {
        collection: collection,
        fields: this.formFields,
        collectionActionType: actionType
      },
      outputOptions: [{
        event: 'collectionSaved',
        callback: (event: WzEvent) => true,
        closeOnEvent: true
      }]
    };
  }

  private get formFields() {
    let fields: Pojo;

    this.uiConfig.get('collection').take(1)
      .subscribe((config: Pojo) => fields = config.config);

    return fields;
  }
}
