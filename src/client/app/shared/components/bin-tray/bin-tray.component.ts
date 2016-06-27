import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { Collection } from '../../../shared/interfaces/collection.interface';
import { CollectionsService} from '../../../+collections/services/collections.service';

/**
 * Home page search component - renders search form passes form values to search component.
 */
@Component({
  moduleId: module.id,
  selector: 'bin-tray',
  templateUrl: 'bin-tray.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BinTrayComponent {
  @Input() collection: Collection;
  @Input() UiState: any;
  public i = 0;
  constructor(
    public router: Router,
    public collectionsService: CollectionsService) {
    this.getCollectionsAndFocused();
  }

  public showCollectionsList() {
    this.UiState.showCollectionsList();
  }

  public getCollectionsAndFocused(): void {
    this.collectionsService.loadCollections().subscribe(payload => {
      this.collectionsService.storeCollections(payload);
      if (payload.totalCount > 0) {
        this.collectionsService.getFocusedCollection().subscribe(collection => {
          if (collection.assets) {
            this.collectionsService.getCollectionItems(collection.id,100).subscribe(search => {
              this.collectionsService.updateFocusedCollectionAssets(collection, search);
            });
          }else {
            this.collectionsService.updateFocusedCollection(collection);
          }
        });
      }
    });
  }

  public showThumb(asset:any) {
    return (asset.summary) ? asset.summary.thumbnail.urls.https : '';
  }
}
