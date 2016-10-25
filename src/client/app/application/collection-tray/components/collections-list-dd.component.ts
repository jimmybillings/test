import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from '../../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../../shared/services/collections.service';
import { UiConfig } from '../../../shared/services/ui.config';
import { CollectionContextService } from '../../../shared/services/collection-context.service';
import { ActiveCollectionService } from '../../../shared/services/active-collection.service';
import { Subscription } from 'rxjs/Rx';
import { UiState } from '../../../shared/services/ui.state';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list-dd',
  templateUrl: 'collections-list-dd.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListDdComponent implements OnInit, OnDestroy {
  @Input() focusedCollection: Collection;
  @Input() uiState: UiState;
  @Input() config: any;
  @Output() close = new EventEmitter();
  public options: any;
  public optionsSubscription: Subscription;
  public pageSize: string;
  public collectionFilterIsShowing: boolean = false;
  public collectionSortIsShowing: boolean = false;
  public collectionSearchIsShowing: boolean = false;

  constructor(
    public router: Router,
    public collections: CollectionsService,
    public collectionContext: CollectionContextService,
    public activeCollection: ActiveCollectionService,
    public uiConfig: UiConfig) {}

  ngOnInit(): void {
    this.uiConfig.get('global').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
    this.optionsSubscription = this.collectionContext.data.subscribe(data => this.options = data);
  }

  ngOnDestroy(): void {
    this.optionsSubscription.unsubscribe();
  }

  public closeCollectionsList(): void {
    this.close.emit();
  }

  public selectFocusedCollection(collection: Collection) {
    if (this.onCollectionShowPage()) {
      this.navigateToCollectionShow(collection.id);
    } else {
      this.activeCollection.set(collection.id).take(1).subscribe(() => {
        this.activeCollection.getItems(collection.id, { i: 1, n: this.pageSize }).take(1).subscribe();
      });
    }
  }

  public navigateToCollectionShow(assetId: number): void {
    this.router.navigate(['/collection/', assetId, { i: 1, n: this.pageSize }]);
  }

  public navigateToCollectionsIndex() {
    this.router.navigate(['/collection']);
  }

  public applyFilter(filter: any) {
    this.collectionContext.updateCollectionOptions({ currentFilter: filter });
    this.collections.load(filter.access).take(1).subscribe();
    this.showCollectionFilter();
  }

  public applySort(sort: any) {
    this.collectionContext.updateCollectionOptions({ currentSort: sort });
    this.collections.load(sort.sort).take(1).subscribe();
    this.showCollectionSort();
  }

  public search(query: any) {
    this.collectionContext.updateCollectionOptions({ currentSearchQuery: query });
    this.collections.load(query).take(1).subscribe();
  }

  public showCollectionFilter() {
    this.collectionFilterIsShowing = !this.collectionFilterIsShowing;
  }

  public showCollectionSort() {
    this.collectionSortIsShowing = !this.collectionSortIsShowing;
  }

  public showCollectionSearch() {
    this.collectionSearchIsShowing = !this.collectionSearchIsShowing;
  }

  public onCollectionShowPage(): boolean {
    return (this.router.url.split('/')[1] === 'collection' && this.router.url.split('/')[2] !== undefined);
  }
}
