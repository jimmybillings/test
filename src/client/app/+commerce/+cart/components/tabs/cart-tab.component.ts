import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../../components/tabs/commerce-edit-tab';

import { CartService } from '../../../../shared/services/cart.service';
import { UiConfig } from '../../../../shared/services/ui.config';
import { MdDialog, MdSnackBar } from '@angular/material';
import { AssetService } from '../../../../shared/services/asset.service';
import { Capabilities } from '../../../../shared/services/capabilities.service';
import { UserPreferenceService } from '../../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../../shared/stores/error.store';
import { WindowRef } from '../../../../shared/services/window-ref.service';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'cart-tab-component',
  templateUrl: 'cart-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartTabComponent extends CommerceEditTab {

  constructor(
    public userCan: Capabilities,
    protected cartService: CartService,
    protected uiConfig: UiConfig,
    protected dialog: MdDialog,
    protected assetService: AssetService,
    protected window: WindowRef,
    protected userPreference: UserPreferenceService,
    protected error: ErrorStore,
    @Inject(DOCUMENT) protected document: any,
    protected snackBar: MdSnackBar,
    protected translate: TranslateService
  ) {
    super(userCan, cartService, uiConfig, dialog, assetService, window, userPreference, error, document, snackBar, translate);
  }

}
