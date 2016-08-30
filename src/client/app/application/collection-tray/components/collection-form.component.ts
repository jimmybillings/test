import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Collection, Collections } from '../../../shared/interfaces/collection.interface';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { Asset } from '../../../shared/interfaces/asset.interface';

import { WzFormComponent } from '../../../shared/components/wz-form/wz.form.component';
import { CollectionsService } from '../../../+collection/services/collections.service';
import { ActiveCollectionService } from '../../../+collection/services/active-collection.service';
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

export class CollectionFormComponent implements OnInit {
  @Input() collection: Collection;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() dialog: any;
  @Input() config: any;
  @Input() UiState: any;

  // public originalName: string;
  public assetForNewCollection: Asset;
  public collections: Collections;
  public collectionsList: Subscription;
  public formItems: Array<FormFields> = [];
  public serverErrors: any;


  @ViewChild(WzFormComponent) private wzForm: WzFormComponent;

  constructor(
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    private detector: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.formItems = this.config.form.items;
  }

  public createCollection(collection: Collection): void {
    collection.tags = (collection.tags) ? collection.tags.split(/\s*,\s*/) : [];
    this.collectionsService.createCollection(collection).take(1).subscribe(collection => {
      this.activeCollection.set(collection.id).take(1).subscribe(() => {
        this.activeCollection.getItems(collection.id, { n: 50 }).take(1).subscribe();
      });
      this.dialog.close();
      this.cancelCollectionCreation();
    }, (Error) => {
      this.serverErrors = Error.json();
      this.detector.markForCheck();
    });
  }

  public cancelCollectionCreation(): void {
    this.formItems = this.formItems.map((field: FormFields) => { field.value = ''; return field; });
    this.wzForm.resetForm();
  }
}
