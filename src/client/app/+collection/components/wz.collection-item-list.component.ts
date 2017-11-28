import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
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
  @Input() collections: Collection;
  @Input() activeCollection: Collection;
  @Output() editCollection = new EventEmitter();
  @Output() showShareMembers = new EventEmitter();
  @Output() setActiveCollection = new EventEmitter();
  @Output() deleteCollection = new EventEmitter();
  @Output() generateCollectionLink = new EventEmitter();
  @Output() duplicateCollection = new EventEmitter();
  @Output() createShareDialog: EventEmitter<Collection> = new EventEmitter();
  public currentCollection: Collection;

  public selectActiveCollection(collectionId: Collection['id']) {
    this.setActiveCollection.emit(collectionId);
  }

  public thumbnail(thumbnail: { urls: { https: string } }): string {
    return (thumbnail && thumbnail.urls && thumbnail.urls.https) ? thumbnail.urls.https : '/assets/img/tbn_missing.jpg';
  }

  public setCurrentCollection(collection: Collection) {
    this.currentCollection = collection;
  }

  public collectionIsShared(collection: Collection): boolean {
    return !!collection.editors || !!collection.viewers ? true : false;
  }

  public edit(collection: Collection) {
    this.editCollection.emit(collection);
  }

  public sharedMembers(collection: Collection) {
    this.showShareMembers.emit(collection);
  }

  public collectionViewerIsOwner(collection: Collection): boolean {
    return collection.userRole === 'owner' ? true : false;
  }

  public delete(collection: Collection): void {
    this.deleteCollection.emit(collection);
  }

  public duplicate(): void {
    this.duplicateCollection.emit(this.currentCollection.id);
  }

  public generateLegacyLink(): void {
    this.generateCollectionLink.emit(this.currentCollection.id);
  }

  public notOwnerOf(collection: Collection) {
    return collection.userRole !== 'owner';
  }

  public onCreateShareDialog(collection: Collection) {
    this.createShareDialog.emit(collection);
  }
}
