import { Component, Input } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { CollectionsService} from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';

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
  @Input() collection: Collection;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() config: Object;
  @Input() UiState: any;

  constructor(
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService) { }

  public createCollection(collection: Collection): void {
    let asset = {};
    this.assetForNewCollection = JSON.parse(sessionStorage.getItem('assetForNewCollection'));
    (collection.tags) ? collection.tags = collection.tags.split(/\s*,\s*/) : collection.tags = [];
    this.assetForNewCollection ? asset = this.assetForNewCollection : asset = null;
    this.createAndAddAsset(collection, asset);
    // Once we solve form resetting/validation for all forms this reset can be removed.
    let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    cForm.reset();
    if (this.assetForNewCollection) sessionStorage.removeItem('assetForNewCollection');
  }

  public createAndAddAsset(collection: Collection, asset: any): void {
    this.collectionsService.createCollection(collection).take(1).subscribe(created => {
      this.collectionsService.createCollectionInStore(created);
      this.activeCollection.updateActiveCollectionStore(created);
      this.activeCollection.set(created.id).take(1).subscribe(focused => {
        if (asset !== null) {
          this.activeCollection.addAsset(created.id, asset).take(1).subscribe(collection => {
            this.activeCollection.getItems(collection.id, 100).take(1).subscribe();
          });
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
