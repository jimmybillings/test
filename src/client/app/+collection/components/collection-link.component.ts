import { Component, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';
var Clipboard = require('clipboard/dist/clipboard');

@Component({
  moduleId: module.id,
  selector: 'collection-link-component',
  templateUrl: 'collection-link.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionLinkComponent implements OnChanges {
  @Input() assets: any;
  @Input() dialog: any;
  public legacyLink: string;

  constructor() {
    new Clipboard('.clipboard-copy');
  }

  ngOnChanges(changes: any) {
    if (changes.assets.currentValue[0]) this.buildLegacyLink(changes.assets.currentValue);
  }

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
