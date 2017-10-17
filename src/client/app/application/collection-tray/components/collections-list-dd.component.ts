import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Collection } from '../../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../../shared/services/collections.service';
import { CollectionContextService } from '../../../shared/services/collection-context.service';
import { Common } from '../../../shared/utilities/common.functions';
import { AppStore } from '../../../app.store';

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
  @Input() config: any;
  @Output() close = new EventEmitter();
  @Output() onCreateCollection = new EventEmitter();
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
    private store: AppStore
  ) { }

  ngOnInit(): void {
    this.collections.load().subscribe();
    this.pageSize = this.store.snapshotCloned(state => state.uiConfig.components.global.config.pageSize.value);
    this.optionsSubscription = this.collectionContext.data.subscribe(data => this.options = data);
  }

  ngOnDestroy(): void {
    this.optionsSubscription.unsubscribe();
  }

  public closeCollectionsList(): void {
    this.close.emit();
  }

  public selectFocusedCollection(collection: Collection) {
    if (Common.onCollectionShowPage(this.router.url)) {
      this.navigateToCollectionShow(collection.id);
    } else {
      this.store.dispatch(factory => factory.activeCollection.set(collection.id));
    }
  }

  public navigateToCollectionShow(collectionId: number): void {
    this.router.navigate(['/collections/', collectionId, { i: 1, n: this.pageSize }]);
  }

  public navigateToCollectionsIndex() {
    this.router.navigate(['/collections']);
  }

  public applyFilter(filter: any) {
    this.collectionContext.updateCollectionOptions({ currentFilter: filter });
    this.collections.load(filter.access).subscribe();
    this.showCollectionFilter();
  }

  public applySort(sort: any) {
    this.collectionContext.updateCollectionOptions({ currentSort: sort });
    this.collections.load(sort.sort).subscribe();
    this.showCollectionSort();
  }

  public search(query: any) {
    this.collectionContext.updateCollectionOptions({ currentSearchQuery: query });
    this.collections.load(query).subscribe();
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
}
