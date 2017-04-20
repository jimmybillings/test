import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../../../components/tabs/commerce-edit-tab';

import { UiConfig } from '../../../../../shared/services/ui.config';
import { MdDialog, MdSnackBar, MdDialogRef } from '@angular/material';
import { AssetService } from '../../../../../shared/services/asset.service';
import { Capabilities } from '../../../../../shared/services/capabilities.service';
import { UserPreferenceService } from '../../../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../../../shared/stores/error.store';
import { WindowRef } from '../../../../../shared/services/window-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { QuoteFormComponent } from '../../../components/quote-form.component';
import { QuoteOptions } from '../../../../../shared/interfaces/commerce.interface';
import { QuoteEditService } from '../../../../../shared/services/quote-edit.service';
import { User } from '../../../../../shared/interfaces/user.interface';
import { Quote } from '../../../../../shared/interfaces/commerce.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-tab-component',
  templateUrl: 'quote-edit-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditTabComponent extends CommerceEditTab {

  constructor(
    public userCan: Capabilities,
    public quoteEditService: QuoteEditService,
    public uiConfig: UiConfig,
    public dialog: MdDialog,
    public assetService: AssetService,
    public window: WindowRef,
    public userPreference: UserPreferenceService,
    public error: ErrorStore,
    @Inject(DOCUMENT) public document: any,
    public snackBar: MdSnackBar,
    public translate: TranslateService
  ) {
    super(userCan, quoteEditService, uiConfig, dialog, assetService, window, userPreference, error, document, snackBar, translate);
  }

  public onOpenQuoteDialog(): void {
    let dialogRef: MdDialogRef<QuoteFormComponent> = this.dialog.open(QuoteFormComponent, {
      height: '400px', position: { top: '10%' }
    });
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.componentInstance.items = this.config.createQuote.items;
    dialogRef.afterClosed().subscribe((form: { emailAddress: string, expirationDate: string }) => {
      if (form) {
        this.sendQuote({
          emailAddress: form.emailAddress,
          expirationDate: form.expirationDate,
          users: this.suggestions,
          purchaseType: this.quoteType
        });
      }
    });
    dialogRef.componentInstance.cacheSuggestions.subscribe((suggestions: User[]) => {
      this.suggestions = suggestions;
    });
  }

  private sendQuote(options: QuoteOptions): void {
    this.quoteEditService.sendQuote(options).take(1).subscribe((res: Quote) => {
      this.showSnackBar({
        key: 'QUOTE.CREATED_FOR_TOAST',
        value: { emailAddress: options.emailAddress }
      });
    }, (err) => {
      console.error(err);
    });
  }

}
