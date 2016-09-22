import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
// import { UiConfig } from '../../shared/services/ui.config';
// import { Observable } from 'rxjs/Rx';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'asset-share',
  templateUrl: 'asset-share.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetShareComponent {
  @Input() uiState: any;
  @Input() config: any;
  @Input() assetThumbnailUrl: any;
  @Input() assetName: any;
  @Output() close = new EventEmitter();
  public assetLinkIsShowing: boolean = false;

  // constructor(
    // public uiConfig: UiConfig) {
    // this.collections = this.collectionsService.data;
  // }

  // ngOnInit(): void {
  //   this.uiConfig.get('global').take(1).subscribe(config => {
  //     this.pageSize = config.config.pageSize.value;
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.optionsSubscription.unsubscribe();
  // }

  public closeAssetShare(): void {
    this.close.emit();
  }

  public showShareLink() {
    this.assetLinkIsShowing = !this.assetLinkIsShowing;
  }
}
