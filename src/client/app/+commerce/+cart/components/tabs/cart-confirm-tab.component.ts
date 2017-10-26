import { Observable } from 'rxjs/Observable';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { LicenseAgreements } from '../../../../shared/interfaces/commerce.interface';
import { LicenseAgreementComponent } from '../../../components/license-agreement/license-agreement.component';
import { Common } from '../../../../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'cart-confirm-tab-component',
  templateUrl: '../../../components/tabs/commerce-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartConfirmTabComponent extends CommerceConfirmTab {
  constructor(
    protected router: Router,
    public cartService: CartService,
    public dialogService: WzDialogService,
    public userCan: CommerceCapabilities
  ) {
    super(router, cartService, dialogService, userCan);
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

  public get showPricing(): Observable<boolean> {
    return Observable.of(true);
  }

  public get quoteIsTrial(): Observable<boolean> {
    return Observable.of(false);
  }

  public get canPurchase(): boolean {
    return this.licensesAreAgreedTo && this.shouldShowLicenseDetailsBtn();
  }
}
