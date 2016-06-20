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

  public getCollectionsAndFocused(): void {
    this.collectionsService.loadCollections().subscribe(payload => {
      this.collectionsService.storeCollections(payload);
    });
    this.collectionsService.getFocusedCollection().subscribe(collection => {
      this.collectionsService.updateFocusedCollection(collection);
    });;
  }

}

