import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
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
  @Input() assetLink: string;
  @Output() close = new EventEmitter();
  @Output() onOpenSnackbar = new EventEmitter();

  public selectInputForCopy(event: any): void {
    event.target.select();
  }
}
