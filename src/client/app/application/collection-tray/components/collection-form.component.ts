import {
  Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Collection, CollectionActionType } from '../../../shared/interfaces/collection.interface';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { Asset } from '../../../shared/interfaces/common.interface';

import { CollectionsService } from '../../../shared/services/collections.service';
import { CollectionContextService } from '../../../shared/services/collection-context.service';
import { UiState } from '../../../shared/services/ui.state';
import { AppStore } from '../../../app.store';
import { Common } from '../../../shared/utilities/common.functions';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collection-form',
  templateUrl: 'collection-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionFormComponent implements OnInit {
  @Input() collection: any = false;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() dialog: any;
  @Input() fields: any;
  @Input() collectionActionType: CollectionActionType = 'create';
  @Output() collectionSaved = new EventEmitter();

  // public originalName: string;
  public assetForNewCollection: Asset;
  public collectionsList: Subscription;
  public formItems: Array<any> = [];
  public serverErrors: any;
  public tr: any;
  private defaultCollectionParams: any = {
    'q': '',
    'accessLevel': 'all',
    's': '',
    'd': '',
    'i': 0,
    'n': 200
  };

  constructor(
    public collections: CollectionsService,
    public uiState: UiState,
    private detector: ChangeDetectorRef,
    private collectionContext: CollectionContextService,
    private store: AppStore
  ) {
  }

  ngOnInit() {
    this.formItems = this.setForm();
    switch (this.collectionActionType) {
      case 'create':
        this.tr = {
          title: 'COLLECTION.NEW_TITLE',
          submitLabel: 'COLLECTION.FORM.SUBMIT_LABEL'
        };
        break;
      case 'edit':
        this.tr = {
          title: 'COLLECTION.EDIT.TITLE',
          submitLabel: 'COLLECTION.EDIT.SUBMIT_LABEL'
        };
        break;
      case 'duplicate':
        this.tr = {
          title: 'COLLECTION.DUPLICATE.TITLE',
          submitLabel: 'COLLECTION.DUPLICATE.SUBMIT_LABEL'
        };
        break;
    }
    this.tr.close = 'COLLECTION.FORM.CLOSE_HOVER_TITLE';
  }

  public collectionAction(collection: Collection) {
    switch (this.collectionActionType) {
      case 'create':
        this.createCollection(collection);
        break;
      case 'edit':
        this.editCollection(collection);
        break;
      case 'duplicate':
        this.duplicateCollection(collection);
        break;
    }
  }

  // -------- END OF PUBLIC INTERFACE --------- //

  private createCollection(collection: Collection): void {
    collection.tags = collection.tags.split(/\s*,\s*/);
    this.collections.create(collection).subscribe(collection => {
      this.refreshCollections();
    }, this.error.bind(this));
  }

  private editCollection(collection: Collection) {
    collection = Object.assign(
      {}, collection, {
        id: this.collection.id,
        tags: collection.tags.split(/\s*,\s*/),
        owner: this.collection.owner
      });
    this.collections.update(collection)
      .subscribe(() => {
        this.loadCollections();
        if (this.store.match(collection.id, state => state.activeCollection.collection.id)) {
          this.getActiveCollection();
        }
      }, this.error.bind(this));
  }

  private duplicateCollection(collection: Collection) {
    collection = Object.assign(
      {}, this.collection, collection, {
        tags: collection.tags.split(/\s*,\s*/)
      });
    this.collections.duplicate(collection)
      .subscribe(() => {
        this.refreshCollections();
      }, this.error.bind(this));
  }

  private loadCollections() {
    this.collections.load(this.defaultCollectionParams)
      .subscribe(() => this.collectionSaved.emit());
  }

  private getActiveCollection() {
    this.store.dispatch(factory => factory.activeCollection.load());
  }

  private error(error: any) {
    this.serverErrors = error.json();
    this.detector.markForCheck();
  }

  private refreshCollections() {
    this.collectionContext.resetCollectionOptions();
    this.getActiveCollection();
    this.loadCollections();
  }

  private setForm() {
    this.fields = Common.clone(this.fields);
    return this.fields.form.items.map((item: any) => {
      if (item.name === 'name' && this.collection) {
        item.value = this.collection.name;
        if (this.collectionActionType === 'duplicate') {
          item.value = `Copy - ${item.value}`;
        }
      }
      if (item.type === 'tags') {
        item.tags = (this.collection && this.collection.tags)
          ? this.collection.tags : [];
        item.value = (this.collection && this.collection.tags)
          ? this.collection.tags.toString() : '';
      }
      return item;
    });
  }

}
