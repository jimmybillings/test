import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-collection-item-list',
  templateUrl: 'wz.collection-item-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * The Pagination component takes an input of the Pagination Object that is returned with
 * all API calls. It ouputs a getPage event with the pageNumber for the API to get.
 */
export class WzCollectionItemListComponent {
  @Input() collections: any;
  @Input() activeCollection: any;
  @Output() editCollection = new EventEmitter();
  @Output() setActiveCollection = new EventEmitter();
  @Output() deleteCollection = new EventEmitter();
  @Output() generateCollectionLink = new EventEmitter();
  public currentCollection: any;

  public selectActiveCollection(collectionId: any) {
    this.setActiveCollection.emit(collectionId);
  }

  public thumbnail(thumbnail: { urls: { https: string } }): string {
    return (thumbnail && thumbnail.urls && thumbnail.urls.https) ? thumbnail.urls.https : '/assets/img/tbn_missing.jpg';
  }

  public setCurrentCollection(collection: any) {
    this.currentCollection = collection;
  }

  public edit(collection: any) {
    this.editCollection.emit(collection);
  }

  public delete(collection: any): void {
    this.deleteCollection.emit(collection);
  }

  public generateLegacyLink(): void {
    this.generateCollectionLink.emit(this.currentCollection.id);
  }


}
