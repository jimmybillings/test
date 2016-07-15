import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { ROUTER_DIRECTIVES, Router} from '@angular/router';
import { Collection } from '../../shared/interfaces/collection.interface';
import { CollectionsService} from '../services/collections.service';
import { Observable} from 'rxjs/Rx';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list-dd',
  templateUrl: 'collections-list-dd.html',
  directives: [ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListDdComponent {

  @Input() focusedCollection: Collection;
  @Input() UiState: any;
  public collections: Observable<Collection[]>;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService) {
    this.collections = this.collectionsService.collections;
  }

  public closeCollectionsList(): void {
    this.UiState.closeCollectionsList();
  }

  public showNewCollection(): void {
    this.UiState.closeCollectionsList();
    this.UiState.showNewCollection();
  }

  public selectFocusedCollection(collection: Collection) {
    if (this.router.url.split('/')[1] === 'collection' && this.router.url.split('/')[2] !== undefined) {
      this.navigateToCollectionShow(collection.id);
    } else {
      this.collectionsService.setFocusedCollection(collection.id).first().subscribe(payload => {
        this.collectionsService.updateFocusedCollection(payload);
        if (collection.assets) {
          this.collectionsService.getCollectionItems(collection.id, 200).first().subscribe(assets => {
            this.collectionsService.updateFocusedCollectionAssets(assets);
          });
        }
      });
      this.UiState.closeCollectionsList();
    }
  }

  public navigateToCollectionShow(assetId: number): void {
    this.UiState.closeCollectionsList();
    this.router.navigate(['/collection/', assetId]);
  }

  public navigateToCollectionsIndex() {
    this.UiState.closeCollectionsList();
    this.router.navigate(['/collection']);
  }

  public showCollectionSearch(event: Event) {
    return event;
  }

  public showCollectionFilter(event: Event) {
    return event;
  }

  public showCollectionSort(event: Event) {
    return event;
  }

}
