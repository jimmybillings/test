import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { QuoteService } from '../../../../shared/services/quote.service';
import { Router } from '@angular/router';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { LicenseAgreements } from '../../../../shared/interfaces/commerce.interface';
import { LicenseAgreementComponent } from '../../../components/license-agreement/license-agreement.component';
import { Common } from '../../../../shared/utilities/common.functions';

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
    public userCan: CommerceCapabilities
  ) {
    super(router, quoteService, dialogService, userCan);
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
}
