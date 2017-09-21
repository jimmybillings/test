import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { StateMapper } from '../../../app.store';
import { Asset } from '../../../shared/interfaces/common.interface';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { UiConfig } from '../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'cart-asset',
  template: `
    <asset-component
      [stateMapper]="stateMapper"
      [assetType]="'cartAsset'"
      [commentFormConfig]="commentFormConfig">
    </asset-component>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartAssetComponent implements OnInit {
  public commentFormConfig: FormFields;

  constructor(private uiConfig: UiConfig) { }

  public ngOnInit(): void {
    this.uiConfig.get('cartComment').take(1).subscribe((config: any) => {
      this.commentFormConfig = config.config.form.items;
    });
  }

  public stateMapper: StateMapper<Asset> = (state) => state.cartAsset.activeAsset;
}
