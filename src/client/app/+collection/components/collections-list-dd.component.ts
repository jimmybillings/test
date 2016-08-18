import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import { Collection, Collections } from '../../shared/interfaces/collection.interface';
import { CollectionsService} from '../services/collections.service';
import { ActiveCollectionService} from '../services/active-collection.service';
import { CollectionFormComponent } from '../../+collection/components/collection-form.component';
import { WzDialogComponent } from '../../shared/components/wz-dialog/wz.dialog.component';
import { CollectionFilterDdComponent } from './collections-filter-dd.component';
import { WzDropdownComponent } from '../../shared/components/wz-dropdown/wz.dropdown.component';
import { Observable} from 'rxjs/Rx';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collections-list-dd',
  templateUrl: 'collections-list-dd.html',
  directives: [
    ROUTER_DIRECTIVES,
    CollectionFormComponent,
    WzDialogComponent,
    WzDropdownComponent,
    CollectionFilterDdComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionListDdComponent {
  @Input() focusedCollection: Collection;
  @Input() UiState: any;
  @Input() config: any;
  public collections: Observable<Collections>;
  public currentFilter: string;
  public collectionFilterIsShowing: boolean = false;
  public filterOptions: any;

  constructor(
    public router: Router,
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService,
    public route: ActivatedRoute) {
      this.currentFilter = 'ALL';
      this.collections = this.collectionsService.data;
      this.filterOptions = [
        { 'id': 0, 'label': 'ALL', 'value': 'all', 'active': true, 'access': {'access-level': 'all'} },
        { 'id': 1, 'label': 'OWNER', 'value': 'owner', 'active': false, 'access': {'access-level': 'owner'} },
        { 'id': 2, 'label': 'EDITOR', 'value': 'editor', 'active': false, 'access': {'access-level': 'editor'} },
        { 'id': 3, 'label': 'VIEWER', 'value': 'viewer', 'active': false, 'access': {'access-level': 'viewer'} },
        { 'id': 4, 'label': 'RESEARCHER', 'value': 'researcher', 'active': false, 'access': {'access-level': 'researcher'} }
    ];
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

  public applyFilter(filter: any) {
    this.currentFilter = filter.label;
    this.filterOptions.forEach((f:any) => f.active = false);
    filter.active = true;
    this.collectionsService.loadCollections(filter.access).take(1).subscribe();
  }

  public showCollectionFilter(event: Event) {
    console.log(this.collectionFilterIsShowing);
    this.collectionFilterIsShowing = !this.collectionFilterIsShowing;
  }

  public showCollectionSort(event: Event) {
    return event;
  }

  public onCollectionShowPage(): boolean {
    return (this.router.url.split('/')[1] === 'collection' && this.router.url.split('/')[2] !== undefined);
  }

}
