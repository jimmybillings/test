import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from '../../shared/interfaces/collection.interface';
import { ActiveCollectionService} from '../../+collection/services/active-collection.service';
import { CollectionsService } from '../../+collection/services/collections.service';
import { Observable } from 'rxjs/Rx';
/**
 * Home page search component - renders search form passes form values to search component.
 */
@Component({
  moduleId: module.id,
  selector: 'collection-tray',
  templateUrl: 'collection-tray.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CollectionTrayComponent implements OnInit {
  @Input() UiState: any;
  @Input() uiConfig: any;
  public collection: Observable<Collection>;

  constructor(public router: Router, public activeCollection: ActiveCollectionService, public collectionsService: CollectionsService) {
    this.collection = activeCollection.data;
  }

  ngOnInit() {
    this.activeCollection.get().take(1).subscribe((collection) => {
      this.collectionsService.loadCollections().take(1).subscribe();
      this.activeCollection.getItems(collection.id, {i: 1, n: 50}).take(1).subscribe();
    });
  }
}
