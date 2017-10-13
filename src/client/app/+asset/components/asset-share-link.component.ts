import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { AppStore } from '../../app.store';

@Component({
  moduleId: module.id,
  selector: 'asset-share-link',
  templateUrl: 'asset-share-link.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetShareLinkComponent {
  @Input() assetLink: string;
  @Output() close = new EventEmitter();

  constructor(private store: AppStore) { }

  public selectInputForCopy(event: any): void {
    event.target.select();
  }

  public onCopyShareLinkButtonClick(): void {
    this.store.dispatch(factory => factory.snackbar.display('ASSET.SHARING.SHARE_LINK.COPIED_CONFIRMED_MESSAGE'));
  }
}
