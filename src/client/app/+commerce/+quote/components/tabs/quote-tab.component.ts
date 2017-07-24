import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuoteService } from '../../../../shared/services/quote.service';
import { Quote, QuoteState, Project, AssetLineItem, FeeLineItem } from '../../../../shared/interfaces/commerce.interface';
import { Tab } from '../../../components/tabs/tab';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { Observable } from 'rxjs/Observable';
import { Feature } from '../../../../shared/interfaces/feature.interface';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { LicenseAgreements } from '../../../../shared/interfaces/commerce.interface';
import { LicenseAgreementComponent } from '../../../components/license-agreement/license-agreement.component';
import { UiConfig } from '../../../../shared/services/ui.config';
import { FormFields } from '../../../../shared/interfaces/forms.interface';
import { QuoteEditService } from '../../../../shared/services/quote-edit.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Pojo } from '../../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-tab',
  templateUrl: 'quote-tab.html'
})

export class QuoteTabComponent extends Tab {
  public quote: Observable<Quote>;
  private config: any;

  constructor(
    public quoteService: QuoteService,
    public userCan: CommerceCapabilities,
    private dialogService: WzDialogService,
    private router: Router,
    private uiConfig: UiConfig,
    private quoteEditService: QuoteEditService,
    private snackBar: MdSnackBar,
    private translate: TranslateService) {
    super();
    this.quote = this.quoteService.data.map(state => state.data);
    this.uiConfig.get('cart').take(1).subscribe((config: any) => this.config = config.config);
  }

  public get hasDiscount(): boolean {
    return !!this.quoteService.state.data.discount;
  }

  public checkout(): void {
    this.quoteService.getPaymentOptions();
    this.goToNextTab();
  }

  public onCloneQuote() {
    this.quoteEditService.cloneQuote(this.quoteService.state.data)
      .do(() => {
        this.router.navigate(['/commerce/activeQuote']);
        this.showSnackBar({
          key: 'QUOTE.CLONE_SUCCESS',
          value: null
        });
      })
      .subscribe();
  }

  public get shouldShowCloneButton(): Observable<boolean> {
    return this.userCan.cloneQuote(this.quoteService.data);
  }

  public get shouldShowLicenseDetailsBtn(): boolean {
    return this.userCan.viewLicenseAgreementsButton(this.quoteService.hasAssetLineItems);
  }

  public get shouldShowExpireQuoteButton(): boolean {
    return this.userCan.administerQuotes() && this.isActiveQuote;
  }

  public get shouldShowCheckoutOptions(): boolean {
    return !this.userCan.administerQuotes() && this.isActiveQuote;
  }

  public get shouldShowRejectQuoteButton(): boolean {
    return !this.userCan.administerQuotes();
  }

  public get shouldShowResendButton(): boolean {
    return this.userCan.administerQuotes() && (this.isExpiredQuote || this.isActiveQuote);
  }

  public showLicenseAgreements(): void {
    this.quoteService.retrieveLicenseAgreements().take(1).subscribe((agreements: LicenseAgreements) => {
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

  public showExpireConfirmationDialog(): void {
    this.dialogService.openConfirmationDialog({
      title: 'QUOTE.EXPIRE.TITLE',
      message: 'QUOTE.EXPIRE.MESSAGE',
      accept: 'QUOTE.EXPIRE.ACCEPT',
      decline: 'QUOTE.EXPIRE.DECLINE'
    }, this.expireQuote);
  }

  public openRejectQuoteDialog(): void {
    this.dialogService.openConfirmationDialog({
      title: 'QUOTE.REJECT.TITLE',
      message: 'QUOTE.REJECT.MESSAGE',
      accept: 'QUOTE.REJECT.ACCEPT',
      decline: 'QUOTE.REJECT.DECLINE'
    }, this.rejectQuote);
  }

  public openResendDialog(): void {
    this.dialogService.openFormDialog(this.config.extendQuote.items, {
      title: 'QUOTE.EXTEND_EXPIRATION'
    }, this.extendQuoteExpiration);
  }

  private get isActiveQuote(): boolean {
    return this.quoteService.state.data.quoteStatus === 'ACTIVE';
  }

  private get isExpiredQuote(): boolean {
    return this.quoteService.state.data.quoteStatus === 'EXPIRED';
  }

  private extendQuoteExpiration = (newDate: { expirationDate: string }): void => {
    this.quoteService.extendExpirationDate(newDate.expirationDate).subscribe(() => {
      this.router.navigate(['/commerce/quotes']);
    });
  }

  private expireQuote = (): void => {
    this.quoteService.expireQuote().subscribe(() => {
      this.router.navigate(['commerce/quotes']);
    });
  }

  private rejectQuote = (): void => {
    this.quoteService.rejectQuote().take(1).subscribe(() => {
      this.router.navigate(['commerce/quotes']);
    });
  }

  private showSnackBar(message: Pojo) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }
}
