import {
  Component, Input, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Collection } from '../../../shared/interfaces/collection.interface';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { Asset } from '../../../shared/interfaces/common.interface';

import { WzFormComponent } from '../../../shared/modules/wz-form/wz.form.component';
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
  @Input() isEdit: boolean = false;
  @Output() collectionSaved = new EventEmitter();

  // public originalName: string;
  public assetForNewCollection: Asset;
  public collectionsList: Subscription;
  public formItems: Array<any> = [];
  public serverErrors: any;
  public tr: any;
  private defaultCollectionParams: any = { 'q': '', 'accessLevel': 'all', 's': '', 'd': '', 'i': 0, 'n': 200 };


  @ViewChild(WzFormComponent) private wzForm: WzFormComponent;

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
    this.tr = {
      title: (this.isEdit) ? 'COLLECTION.EDIT.TITLE' : 'COLLECTION.NEW_TITLE',
      close: 'COLLECTION.FORM.CLOSE_HOVER_TITLE',
      submitLabel: (this.isEdit) ? 'COLLECTION.EDIT.SUBMIT_LABEL' : 'COLLECTION.FORM.SUBMIT_LABEL'
    };
  }

  public collectionAction(collection: Collection) {
    (this.isEdit) ? this.editCollection(collection) : this.createCollection(collection);
  }

  public createCollection(collection: Collection): void {
    collection.tags = (collection.tags) ? collection.tags.split(/\s*,\s*/) : [];
    this.collections.create(collection).subscribe(collection => {
      this.collectionContext.resetCollectionOptions();
      this.getActiveCollection();
      this.loadCollections();
    }, this.error.bind(this));
  }

  public editCollection(collection: Collection) {
    collection = Object.assign(
      {}, collection, {
        id: this.collection.id, tags: (collection.tags !== '') ? collection.tags.split(/\s*,\s*/) : [], owner: this.collection.owner
      });
    this.collections.update(collection)
      .subscribe(() => {
        this.loadCollections();
        if (this.store.match(collection.id, state => state.activeCollection.collection.id)) this.getActiveCollection();
      }, this.error.bind(this));
  }

  public loadCollections() {
    this.collections.load(this.defaultCollectionParams)
      .subscribe(this.success.bind(this));
  }

  public getActiveCollection() {
    this.store.dispatch(factory => factory.activeCollection.load());
  }

  public success(): void {
    this.formItems = this.clearForm();
    this.wzForm.resetForm();
    this.detector.markForCheck();
    this.collectionSaved.emit();
  }

  private error(error: any) {
    this.serverErrors = error.json();
    this.detector.markForCheck();
  }

  private clearForm() {
    return this.formItems
      .map((field: FormFields) => {
        field.value = '';
        if (field.type === 'tags') field.tags = [];
        return field;
      });
  }

  private setForm() {
    this.fields = Common.clone(this.fields);
    return this.fields.form.items.map((item: any) => {
      if (item.name === 'name' && this.collection) item.value = this.collection.name;
      if (item.type === 'tags') {
        item.tags = (this.collection && this.collection.tags) ? this.collection.tags : [];
        item.value = (this.collection && this.collection.tags) ? this.collection.tags.toString() : '';
      }
      return Object.assign({}, item);
    });
  }

}
