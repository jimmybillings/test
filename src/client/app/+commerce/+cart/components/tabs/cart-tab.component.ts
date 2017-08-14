import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../../components/tabs/commerce-edit-tab';
import { LicenseAgreements } from '../../../../shared/interfaces/commerce.interface';
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
import { PricingStore } from '../../../../shared/stores/pricing.store';
import { FeatureStore } from '../../../../shared/stores/feature.store';
import { Feature } from '../../../../shared/interfaces/feature.interface';
import { LicenseAgreementComponent } from '../../../components/license-agreement/license-agreement.component';

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
    public translate: TranslateService,
    public pricingStore: PricingStore,
    public featureStore: FeatureStore
  ) {
    super(
      userCan, cartService, uiConfig, dialogService, assetService, window,
      userPreference, error, document, snackBar, translate, pricingStore,
      null, null
    );
  }

  public checkout(): void {
    this.goToNextTab();
    this.cartService.getPaymentOptions();
  }

  public shouldShowLicenseDetailsBtn(): boolean {
    return this.userCan.viewLicenseAgreementsButton(this.cartService.hasAssetLineItems);
  }

  public showLicenseAgreements(): void {
    this.cartService.retrieveLicenseAgreements().take(1).subscribe((agreements: LicenseAgreements) => {
      this.dialogService.openComponentInDialog(
        {
          componentType: LicenseAgreementComponent,
          dialogConfig: { panelClass: 'license-pane', position: { top: '10%' } },
          inputOptions: {
            licenses: JSON.parse(JSON.stringify(agreements)),
          },
        }
      );
    });
  }
}
