import {Component, Input, Output, EventEmitter} from '@angular/core';
import { Collection } from '../shared/interfaces/collection.interface';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';
import { CollectionsService} from './services/collections.service';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collection-form',
  templateUrl: 'collection-form.html',
  directives: [
    WzFormComponent
  ],
  pipes: [TranslatePipe]
})

export class CollectionFormComponent {
  public originalName: string;
  public assetForNewCollection: any;
  public focusedCollection: Collection;
  @Input() collection: Collection;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() config: Object;
  @Input() UiState: any;
  @Output() create = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  constructor(public collectionsService: CollectionsService) { }

  createCollection(collection: Collection): void {
    this.assetForNewCollection = JSON.parse(sessionStorage.getItem('assetForNewCollection'));
    (collection.tags) ? collection.tags = collection.tags.split(/\s*,\s*/) : collection.tags = [];
    this.assetForNewCollection ? collection.assets = [this.assetForNewCollection.assetId] : collection.assets = [];
    this.saveCollection(collection);
    // clear the form so you can make another Collection
    // let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    // cForm.reset();
    // done with sessionStorage, so it can be removed.
    if (this.assetForNewCollection) sessionStorage.removeItem('assetForNewCollection');
  }

  public saveCollection(collection: Collection): void {
    this.collectionsService.createCollection(collection).subscribe(payload => {
      this.collectionsService.createCollectionInStore(payload);
      this.collectionsService.updateFocusedCollection(payload);
    });
    this.UiState.closeNewCollection();
  }

  public cancelCollectionCreation(event: Event): void {
    this.UiState.closeNewCollection();
    // TODO we need a way to clear the form access like: 
    // WzFormComponent.resetForm();
    let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    cForm.reset();
    // done with sessionStorage, so it can be removed.
    sessionStorage.removeItem('assetForNewCollection');
  }
}
