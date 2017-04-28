import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../../components/tabs/commerce-edit-tab';

import { CartService } from '../../../../shared/services/cart.service';
import { UiConfig } from '../../../../shared/services/ui.config';
import { MdSnackBar } from '@angular/material';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AssetService } from '../../../../shared/services/asset.service';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { UserPreferenceService } from '../../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../../shared/stores/error.store';
import { WindowRef } from '../../../../shared/services/window-ref.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  moduleId: module.id,
  selector: 'cart-tab-component',
  templateUrl: 'cart-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartTabComponent extends CommerceEditTab {

  constructor(
    public userCan: CommerceCapabilities,
    public cartService: CartService,
    public uiConfig: UiConfig,
    public dialogService: WzDialogService,
    public assetService: AssetService,
    public window: WindowRef,
    public userPreference: UserPreferenceService,
    public error: ErrorStore,
    @Inject(DOCUMENT) public document: any,
    public snackBar: MdSnackBar,
    public translate: TranslateService
  ) {
    super(userCan, cartService, uiConfig, dialogService, assetService, window, userPreference, error, document, snackBar, translate);
  }
}
