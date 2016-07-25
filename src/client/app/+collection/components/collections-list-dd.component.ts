import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import { Collection, Collections } from '../../shared/interfaces/collection.interface';
import { CollectionsService} from '../services/collections.service';
import { ActiveCollectionService} from '../services/active-collection.service';

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
  public collections: Observable<Collections>;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public route: ActivatedRoute) {
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
    if (this.onCollectionShowPage()) {
      this.navigateToCollectionShow(collection.id);
    } else {
      this.activeCollection.set(collection.id).take(1).subscribe(() => {
        this.activeCollection.getItems(collection.id, 300).take(1).subscribe();
      });
      this.closeCollectionsList();
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

  public onCollectionShowPage(): boolean {
    return (this.router.url.split('/')[1] === 'collection' && this.router.url.split('/')[2] !== undefined);
  }

}
