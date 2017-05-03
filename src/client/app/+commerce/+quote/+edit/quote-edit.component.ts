import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../components/tabs/commerce-edit-tab';

import { UiConfig } from '../../../shared/services/ui.config';
import { MdDialog, MdSnackBar, MdDialogRef } from '@angular/material';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AssetService } from '../../../shared/services/asset.service';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../shared/stores/error.store';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { QuoteOptions, Project, FeeLineItem } from '../../../shared/interfaces/commerce.interface';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Quote } from '../../../shared/interfaces/commerce.interface';
import { WzEvent } from '../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-component',
  templateUrl: 'quote-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditComponent extends CommerceEditTab {

  constructor(
    public userCan: Capabilities,
    public quoteEditService: QuoteEditService,
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
    super(
      userCan, quoteEditService, uiConfig, dialogService, assetService, window, userPreference, error, document, snackBar, translate
    );
  }

  public onNotification(message: WzEvent): void {
    switch (message.type) {

      case 'OPEN_QUOTE_DIALOG':
        this.openQuoteDialog();
        break;

      case 'ADD_BULK_ORDER_ID':
        this.addBulkOrderId();
        break;

      case 'EDIT_DISCOUNT':
        this.editDiscount();
        break;

      case 'ADD_QUOTE_FEE':
        this.quoteEditService.addFeeTo(message.payload.project, message.payload.fee);
        break;

      case 'REMOVE_QUOTE_FEE':
        this.quoteEditService.removeFee(message.payload);
        break;

      default:
        super.onNotification(message);
    };
  }

  public get bulkOrderIdActionLabel(): string {
    return (this.hasProperty('bulkOrderId')) ? 'QUOTE.EDIT_BULK_ORDER_ID_TITLE' : 'QUOTE.ADD_BULK_ORDER_ID_TITLE';
  }

  public get discountActionLabel(): string {
    return (this.hasProperty('discount')) ? 'QUOTE.EDIT_DISCOUNT_TITLE' : 'QUOTE.ADD_DISCOUNT_TITLE';
  }

  public get bulkOrderIdSubmitLabel(): string {
    return (this.hasProperty('bulkOrderId')) ? 'QUOTE.EDIT_BULK_ORDER_ID_TITLE' : 'QUOTE.ADD_BULK_ORDER_ID_TITLE';
  }

  public get discountSubmitLabel(): string {
    return (this.hasProperty('discount')) ? 'QUOTE.EDIT_DISCOUNT_TITLE' : 'QUOTE.ADD_DISCOUNT_TITLE';
  }

  public get showDiscount(): boolean {
    return (this.hasProperty('discount') && this.quoteType !== 'ProvisionalOrder') ? true : false;
  }

  public addBulkOrderId() {
    this.dialogService.openFormDialog(
      this.mergeFormValues(this.config.addBulkOrderId.items, 'bulkOrderId'),
      {
        title: this.bulkOrderIdActionLabel,
        submitLabel: this.bulkOrderIdSubmitLabel,
        autocomplete: 'off'
      },
      this.updateQuoteField
    );
  }

  public editDiscount() {
    this.dialogService.openFormDialog(
      this.mergeFormValues(this.config.addDiscount.items, 'discount'),
      {
        title: this.discountActionLabel,
        submitLabel: this.discountSubmitLabel,
        autocomplete: 'off'
      },
      this.updateQuoteField
    );
  }

  private openQuoteDialog(): void {
    this.dialogService.openFormDialog(
      this.config.createQuote.items,
      { title: 'QUOTE.CREATE_HEADER', submitLabel: 'QUOTE.SEND_BTN', autocomplete: 'off' },
      this.onSubmitQuoteDialog
    );
  }

  private updateQuoteField = (options: any) => {
    this.quoteEditService.updateQuoteField(options);
  }

  private onSubmitQuoteDialog = (result: { emailAddress: string, expirationDate: string, suggestions: any[] }): void => {
    this.sendQuote({
      emailAddress: result.emailAddress,
      expirationDate: result.expirationDate,
      users: result.suggestions,
      purchaseType: this.quoteType
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

  private hasProperty = (property: string) => {
    let has;
    this.quoteEditService.hasProperty(property)
      .take(1).subscribe((value: string) => {
        has = value;
      });
    return has;
  }

  private mergeFormValues(fields: any, property: string) {
    return fields.map((item: any) => {
      let value = this.hasProperty(property);
      item.value = value ? value : '';
      return item;
    });
  }
}
