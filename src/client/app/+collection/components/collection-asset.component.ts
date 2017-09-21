import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateMapper, AppStore } from '../../app.store';
import { Asset } from '../../shared/interfaces/common.interface';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { CommentParentObject } from '../../shared/interfaces/comment.interface';
import { UiConfig } from '../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'collection-asset',
  template: `
    <asset-component
      [stateMapper]="stateMapper"
      [assetType]="'collectionAsset'"
      [commentFormConfig]="commentFormConfig">
    </asset-component>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionAssetComponent implements OnInit {
  public commentFormConfig: FormFields;

  constructor(private store: AppStore, private uiConfig: UiConfig) { }

  public ngOnInit(): void {
    this.uiConfig.get('collectionComment').take(1).subscribe((config: any) => {
      this.commentFormConfig = config.config.form.items;
    });
  }

  public stateMapper: StateMapper<Asset> = (state) => state.activeCollectionAsset.activeAsset;
}
