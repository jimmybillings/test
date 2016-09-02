import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Collection, Collections } from '../../../shared/interfaces/collection.interface';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { Asset } from '../../../shared/interfaces/asset.interface';

import { WzFormComponent } from '../../../shared/components/wz-form/wz.form.component';
import { CollectionsService } from '../../../+collection/services/collections.service';
import { ActiveCollectionService } from '../../../+collection/services/active-collection.service';
import { CollectionContextService } from '../../../shared/services/collection-context.service';
import { UiState } from '../../../shared/services/ui.state';
import { Subscription } from 'rxjs/Rx';
/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collection-form',
  templateUrl: 'collection-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionFormComponent implements OnInit, OnChanges {
  @Input() collection: any = false;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() dialog: any;
  @Input() config: any;
  @Input() isEdit: boolean = false;

  // public originalName: string;
  public assetForNewCollection: Asset;
  public collections: Collections;
  public collectionsList: Subscription;
  public formItems: Array<any> = [];
  public serverErrors: any;
  public tr: any;
  private defaultCollectionParams: any = { 'q': '', 'access-level': 'all', 's': '', 'd': '', 'i': 0, 'n': 200 };


  @ViewChild(WzFormComponent) private wzForm: WzFormComponent;

  constructor(
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public uiState: UiState,
    private detector: ChangeDetectorRef,
    private collectionContext: CollectionContextService
    ) {
  }

  ngOnInit() {
    this.formItems = this.setForm();
    this.tr = {
      title: (this.isEdit) ? 'COLLECTION.EDIT.TITLE' : 'COLLECTION.NEW_TITLE',
      close: 'COLLECTION.FORM.CLOSE_HOVER_TITLE',
      submitLabel: (this.isEdit) ? 'COLLECTION.EDIT.SUBMIT_LABEL' : 'COLLECTION.FORM.SUBMIT_LABEL'
    };
  }

  ngOnChanges(changes: any) {
    if (changes.collection && changes.collection.currentValue) {
      this.formItems = this.setForm();
    }
  }

  public collectionAction(collection: Collection) {
    (this.isEdit) ? this.editCollection(collection) : this.createCollection(collection);
  }

  public createCollection(collection: Collection): void {
    this.uiState.loading(true);
    collection.tags = (collection.tags) ? collection.tags.split(/\s*,\s*/) : [];
    this.collectionsService.createCollection(collection).take(1).subscribe(collection => {
      this.loadCollections();
      this.collectionContext.resetCollectionOptions();
      this.activeCollection.set(collection.id).take(1).subscribe(() => {
        this.activeCollection.getItems(collection.id, { n: 50 }).take(1).subscribe();
      });
    }, this.error.bind(this));
  }

  public editCollection(collection: Collection) {
    this.uiState.loading(true);
    collection = Object.assign({}, collection,
      { id: this.collection.id, tags: collection.tags.split(/\s*,\s*/), owner: this.collection.owner });
    this.collectionsService.updateCollection(collection).take(1)
      .subscribe(this.loadCollections.bind(this), this.error.bind(this));
  }

  public loadCollections() {
    this.collectionsService.loadCollections(this.defaultCollectionParams)
      .take(1).subscribe(this.success.bind(this));
  }

  private success(): void {
    this.formItems = this.clearForm();
    this.wzForm.resetForm();
    this.uiState.loading(false);
    this.detector.markForCheck();
    this.dialog.close();
  }

  private error(error: any) {
    this.serverErrors = error.json();
    this.detector.markForCheck();
    this.uiState.loading(false);
  }

  private clearForm() {
    return this.formItems
      .map((field:FormFields) => {
        field.value = '';
        if (field.type === 'tags') field.tags = [];
        return field;
      });
  }

  private setForm() {
    return this.config.form.items.map((item: any) => {
      if (item.name === 'name' && this.collection) item.value = this.collection.name;
      if (item.type === 'tags') {
        item.tags = (this.collection && this.collection.tags) ? this.collection.tags : [];
        item.value = (this.collection  && this.collection.tags) ? this.collection.tags.toString() : '';
      }
      return item;
    });
  }

}
