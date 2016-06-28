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

  constructor(
    public router: Router,
    public collectionsService: CollectionsService) {
    this.getCollectionsAndFocused();
  }

  public showCollectionsList() {
    this.UiState.showCollectionsList();
  }


  // make this 2 request with errors get collections and then focused
  public getCollectionsAndFocused(): void {
    this.collectionsService.loadCollections().subscribe(payload => {
      // for each collection with assets get a thumbnail img
      // this is used to identify collections
      if (payload.totalCount > 0) {
        payload.items.forEach((item: any, index: number) => {
          if (item.assets) {
            this.collectionsService.getCollectionItems(item.id, 1, item.assets.length - 1).subscribe(search => {
              let assets = Object.assign({},
                { 'items': payload.items[index].assets },
                { 'pagination': { 'totalCount': search.totalCount } }
              );
              payload.items[index] = Object.assign({},
                { 'createdOn': payload.items[index].createdOn },
                { 'id': payload.items[index].id },
                { 'lastUpdated': payload.items[index].lastUpdated },
                { 'name': payload.items[index].name },
                { 'owner': payload.items[index].owner },
                { 'siteName': payload.items[index].siteName },
                { 'tags': payload.items[index].tags },
                { 'thumbnail': search.items[0].thumbnail },
                { 'assets': assets }
              );
            });
          }
        });
      }
      console.log(payload);
      this.collectionsService.storeCollections(payload);

      // get focused collection assets and thumbnails
      if (payload.totalCount > 0) {
        this.collectionsService.getFocusedCollection().subscribe(collection => {
          if (collection.assets) {
            this.collectionsService.getCollectionItems(collection.id, 300).subscribe(search => {
              this.collectionsService.updateFocusedCollectionAssets(collection, search);
            });
          } else {
            this.collectionsService.updateFocusedCollection(collection);
          }
        });
      }
    });
  }
  // error => this.error.handle(error);

}
