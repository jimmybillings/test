import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../components/tabs/commerce-edit-tab';

import { UiConfig } from '../../../shared/services/ui.config';
import { MdSnackBar } from '@angular/material';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AssetService } from '../../../shared/services/asset.service';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { ErrorStore } from '../../../shared/stores/error.store';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { QuoteOptions, Project, FeeLineItem, Quote, AssetLineItem } from '../../../shared/interfaces/commerce.interface';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { User } from '../../../shared/interfaces/user.interface';
import { WzEvent } from '../../../shared/interfaces/common.interface';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { PricingStore } from '../../../shared/stores/pricing.store';

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
    public translate: TranslateService,
    public pricingStore: PricingStore
  ) {
    super(
      userCan, quoteEditService, uiConfig, dialogService, assetService, window,
      userPreference, error, document, snackBar, translate, pricingStore
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

      case 'SHOW_COST_MULTIPLIER_DIALOG':
        this.openCostMultiplierDialog(message.payload);
        break;

      default:
        super.onNotification(message);
    };
  }

  public get bulkOrderIdActionLabel(): string {
    return this.hasProperty('bulkOrderId') ? 'QUOTE.EDIT_BULK_ORDER_ID_TITLE' : 'QUOTE.ADD_BULK_ORDER_ID_TITLE';
  }

  public get discountActionLabel(): string {
    return this.hasProperty('discount') ? 'QUOTE.EDIT_DISCOUNT_TITLE' : 'QUOTE.ADD_DISCOUNT_TITLE';
  }

  public get bulkOrderIdSubmitLabel(): string {
    return this.hasProperty('bulkOrderId') ? 'QUOTE.EDIT_BULK_ORDER_FORM_SUBMIT' : 'QUOTE.ADD_BULK_ORDER_FORM_SUBMIT';
  }

  public get discountSubmitLabel(): string {
    return this.hasProperty('discount') ? 'QUOTE.EDIT_DISCOUNT_FORM_SUBMIT' : 'QUOTE.ADD_DISCOUNT_FORM_SUBMIT';
  }

  public get showDiscount(): boolean {
    return (this.hasProperty('discount') && this.quoteType !== 'ProvisionalOrder') ? true : false;
  }

  public addBulkOrderId(): void {
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

  public editDiscount(): void {
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

  private updateQuoteField = (options: any): void => {
    this.quoteEditService.updateQuoteField(options);
  }

  private onSubmitQuoteDialog = (result: { emailAddress: string, expirationDate: string }): void => {
    this.sendQuote({
      ownerEmail: result.emailAddress,
      expirationDate: new Date(result.expirationDate).toISOString(),
      purchaseType: this.quoteType
    });
  }

  private sendQuote(options: QuoteOptions): void {
    this.quoteEditService.sendQuote(options).take(1).subscribe((res: Quote) => {
      this.showSnackBar({
        key: 'QUOTE.CREATED_FOR_TOAST',
        value: { emailAddress: options.ownerEmail }
      });
    }, (err) => {
      console.error(err);
    });
  }

  private hasProperty = (property: string): string | undefined => {
    let has;
    this.quoteEditService.hasProperty(property)
      .take(1).subscribe((value: string | undefined) => {
        has = value;
      });
    return has;
  }

  private mergeFormValues(fields: any, property: string): Array<FormFields> {
    return fields.map((item: any) => {
      let value = this.hasProperty(property);
      item.value = value ? value : '';
      return item;
    });
  }

  private openCostMultiplierDialog(lineItem: AssetLineItem): void {
    this.dialogService.openFormDialog(
      this.config.addCostMultiplier.items,
      { title: 'QUOTE.ADD_MULTIPLIER_TITLE', submitLabel: 'QUOTE.ADD_MULTIPLIER_FORM_SUBMIT' },
      (result: { multiplier: string }): void => this.quoteEditService.editLineItem(lineItem, result)
    );
  }
}
