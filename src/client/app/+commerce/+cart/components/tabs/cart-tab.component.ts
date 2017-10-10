import { Component, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../../components/tabs/commerce-edit-tab';
import { LicenseAgreements, Project } from '../../../../shared/interfaces/commerce.interface';
import { CartService } from '../../../../shared/services/cart.service';
import { UiConfig } from '../../../../shared/services/ui.config';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AssetService } from '../../../../store/asset/asset.service';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { UserPreferenceService } from '../../../../shared/services/user-preference.service';
import { WindowRef } from '../../../../shared/services/window-ref.service';
import { PricingStore } from '../../../../shared/stores/pricing.store';
import { FeatureStore } from '../../../../shared/stores/feature.store';
import { Feature } from '../../../../shared/interfaces/feature.interface';
import { LicenseAgreementComponent } from '../../../components/license-agreement/license-agreement.component';
import { PricingService } from '../../../../shared/services/pricing.service';
import { Subscription } from 'rxjs/Subscription';
import { Common } from '../../../../shared/utilities/common.functions';
import { AppStore } from '../../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'cart-tab-component',
  templateUrl: 'cart-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartTabComponent extends CommerceEditTab implements OnDestroy {
  public projects: Project[];
  private projectSubscription: Subscription;

  constructor(
    public userCan: CommerceCapabilities,
    public cartService: CartService,
    public uiConfig: UiConfig,
    public dialogService: WzDialogService,
    public assetService: AssetService,
    public window: WindowRef,
    public userPreference: UserPreferenceService,
    @Inject(DOCUMENT) public document: any,
    public pricingStore: PricingStore,
    public featureStore: FeatureStore,
    public pricingService: PricingService,
    protected store: AppStore
  ) {
    super(
      userCan, cartService, uiConfig, dialogService, assetService, window,
      userPreference, document, pricingStore,
      store, pricingService
    );
    this.projectSubscription = this.cartService.projects.subscribe(projects => this.projects = projects);
  }

  public ngOnDestroy() {
    this.projectSubscription.unsubscribe();
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
            assetType: 'cartAsset',
            licenses: Common.clone(agreements)
          },
          outputOptions: [
            {
              event: 'close',
              callback: () => true,
              closeOnEvent: true
            }
          ]
        }
      );
    });
  }
}
