import { Component, Input } from '@angular/core';
import { Collection } from '../shared/interfaces/collection.interface';
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
  ]
})

export class CollectionFormComponent {
  public originalName: string;
  public assetForNewCollection: any;
  public focusedCollection: Collection;
  @Input() collection: Collection;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() config: Object;
  @Input() UiState: any;

  constructor(public collectionsService: CollectionsService) { }

  createCollection(collection: Collection): void {
    let asset = {};
    this.assetForNewCollection = JSON.parse(sessionStorage.getItem('assetForNewCollection'));
    (collection.tags) ? collection.tags = collection.tags.split(/\s*,\s*/) : collection.tags = [];
    this.assetForNewCollection ? asset = this.assetForNewCollection : asset = null;
    this.createAndAddAsset(collection, asset);
    if (this.assetForNewCollection) sessionStorage.removeItem('assetForNewCollection');
  }

  public createAndAddAsset(collection: Collection, asset: any): void {
    this.collectionsService.createCollection(collection).subscribe(created => {
      this.collectionsService.createCollectionInStore(created);
      this.collectionsService.setFocusedCollection(created.id).subscribe(focused => {
        if (asset !== null) {
          this.collectionsService.addAssetsToCollection(created.id, asset).subscribe(payload => {
            this.collectionsService.getCollectionItems(payload.id, 100).subscribe(search => {
              this.collectionsService.updateFocusedCollectionAssets(payload, search);
            });
          });
        } else {
          this.collectionsService.updateFocusedCollection(created);
        }
      });
    });
    this.UiState.closeNewCollection();
  }

  public cancelCollectionCreation(event: Event): void {
    this.UiState.closeNewCollection();
    let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    cForm.reset();
    sessionStorage.removeItem('assetForNewCollection');
  }
}
