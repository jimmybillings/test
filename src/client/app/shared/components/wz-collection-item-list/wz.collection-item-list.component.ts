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
  @Output() setActiveCollection = new EventEmitter();

  public selectActiveCollection(collectionId:any) {
      console.log(collectionId);
      this.setActiveCollection.emit(collectionId);
  }

  public date(date: any): Date {
    return new Date(date);
  }

  public thumbnail(thumbnail: { urls: { https: string } }): string {
    return (thumbnail) ? thumbnail.urls.https : '/assets/img/tbn_missing.jpg';
  }
}
