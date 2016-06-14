import {Component, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { Collection } from '../shared/interfaces/collection.interface';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';

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

export class CollectionFormComponent implements OnChanges {
  public originalName: string;
  public assetForNewCollection: any;
  public focusedCollection: Collection;
  @Input() collection: Collection;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() config: Object;
  @Output() create = new EventEmitter();
  @Output() cancelled = new EventEmitter();


  ngOnChanges(): void {
    // for user without any collections, we need to get the asset that triggered the new form.
    this.assetForNewCollection = JSON.parse(sessionStorage.getItem('assetForNewCollection'));
  }

  createCollection(collection: Collection): void {
    collection.tags = collection.tags.split(',');
    this.assetForNewCollection ? collection.assets = [this.assetForNewCollection.assetId] : collection.assets = [];
    this.create.emit(collection);
    // clear the form so you can make another Collection
    let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    cForm.reset();
    // done with sessionStorage, so it can be removed.
    if (this.assetForNewCollection) sessionStorage.removeItem('assetForNewCollection');
  }

  public cancelCollectionCreation(event: Event): void {
    this.cancelled.emit(event);
    let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    cForm.reset();
    // done with sessionStorage, so it can be removed.
    sessionStorage.removeItem('assetForNewCollection');
  }
}
