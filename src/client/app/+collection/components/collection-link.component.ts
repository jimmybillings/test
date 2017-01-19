import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'collection-link-component',
  templateUrl: 'collection-link.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionLinkComponent {
  @Input()
  set assets(value: any) {
    this.buildLegacyLink(value);
  }
  @Input() dialog: any;
  @Output() onOpenSnackbar = new EventEmitter();

  public legacyLink: string;

  public buildLegacyLink(assets: any): void {
    let filterSegment: string;
    filterSegment = assets.reduce((prev: string, current: any, i: number) => {
      (i !== assets.length - 1) ? prev += current.assetId + ' OR ' : prev += current.assetId;
      return prev;
    }, '');
    this.legacyLink = `https://commerce.wazeedigital.com/license/searchResults.do?search.keywords=id:(${filterSegment})`;
  }

  public selectInputForCopy(event: any): void {
    event.target.select();
  }
}
