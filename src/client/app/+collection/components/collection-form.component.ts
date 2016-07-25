import { Component, Input } from '@angular/core';
import { Collection, Collections } from '../../shared/interfaces/collection.interface';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { CollectionsService} from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
import { Observable} from 'rxjs/Rx';

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
  public collections: Observable<Collections>;
  @Input() collection: Collection;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() config: Object;
  @Input() UiState: any;

  constructor(
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService) {
      this.collections = this.collectionsService.collections;
  }

  public createCollection(collection: Collection): void {
    collection.tags = (collection.tags) ? collection.tags.split(/\s*,\s*/) : [];
    this.collectionsService.createCollection(collection).take(1).subscribe(collection => {
      this.activeCollection.set(collection.id).take(1).subscribe(() => {
        this.activeCollection.getItems(collection.id, 100).take(1).subscribe();
      });
    });

    this.cancelCollectionCreation();
  }

  public cancelCollectionCreation(): void {
    this.UiState.closeNewCollection();
    let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    cForm.reset();
  }
}
