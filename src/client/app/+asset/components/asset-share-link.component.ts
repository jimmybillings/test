import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
/**
 * Directive that renders a list of collections
 */

@Component({
  moduleId: module.id,
  selector: 'asset-share-link',
  templateUrl: 'asset-share-link.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetShareLinkComponent {
  @Input() UiState: any;
  @Input() assetLink: string;
  @Output() close = new EventEmitter();

  public closeAssetShareLink(): void {
    this.UiState.closeAssetShareLink();
  }

  public selectInputForCopy(event:any): void {
    event.target.select();
  }

  public copyToClipboard(event:any): void {
    console.log(event);
  }
}
