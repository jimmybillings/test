import { Observable } from 'rxjs/Observable';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { Router } from '@angular/router';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { LicenseAgreements, OrderableType } from '../../../../shared/interfaces/commerce.interface';
import { LicenseAgreementComponent } from '../../../components/license-agreement/license-agreement.component';
import { Common } from '../../../../shared/utilities/common.functions';
import { AppStore } from '../../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'quote-confirm-tab',
  templateUrl: '../../../components/tabs/commerce-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteConfirmTabComponent extends CommerceConfirmTab {
  constructor(
    protected router: Router,
    public quoteService: QuoteService,
    public dialogService: WzDialogService,
    public userCan: CommerceCapabilities,
    protected store: AppStore
  ) {
    super(router, quoteService, dialogService, userCan, store);
  }

  public showLicenseAgreements(): void {
    this.commerceService.retrieveLicenseAgreements().take(1).subscribe((agreements: LicenseAgreements) => {
      this.dialogService.openComponentInDialog(
        {
          componentType: LicenseAgreementComponent,
          dialogConfig: { panelClass: 'license-pane', position: { top: '10%' } },
          inputOptions: {
            assetType: 'quoteShowAsset',
            parentId: this.quoteService.state.data.id,
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

  public get quoteIsTrial(): Observable<boolean> {
    return this.quoteService.data.map(quote => quote.data.purchaseType === 'Trial');
  }

  public get canPurchase(): boolean {
    return (this.quoteService.state.data.purchaseType === 'Trial') ||
      (this.licensesAreAgreedTo && this.shouldShowLicenseDetailsBtn());
  }
}
