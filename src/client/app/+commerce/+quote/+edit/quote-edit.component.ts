import { Component, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CommerceEditTab } from '../../components/tabs/commerce-edit-tab';
import { Router } from '@angular/router';
import { UiConfig } from '../../../shared/services/ui.config';
import { MatSnackBar } from '@angular/material';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AssetService } from '../../../store/services/asset.service';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { QuoteOptions, Project, QuoteType, Quote, AssetLineItem } from '../../../shared/interfaces/commerce.interface';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { User } from '../../../shared/interfaces/user.interface';
import { WzEvent } from '../../../shared/interfaces/common.interface';
import { FormFields, MdSelectOption } from '../../../shared/interfaces/forms.interface';
import { PricingStore } from '../../../shared/stores/pricing.store';
import { CommentParentObject } from '../../../shared/interfaces/comment.interface';
import { AppStore } from '../../../app.store';
import { PricingService } from '../../../shared/services/pricing.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-component',
  templateUrl: 'quote-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditComponent extends CommerceEditTab implements OnDestroy {
  public commentFormConfig: Array<FormFields>;
  public commentParentObject: CommentParentObject;
  public showComments: boolean = null;
  public projects: Project[];
  private projectSubscription: Subscription;

  constructor(
    public userCan: Capabilities,
    public quoteEditService: QuoteEditService,
    public uiConfig: UiConfig,
    public dialogService: WzDialogService,
    public assetService: AssetService,
    public window: WindowRef,
    public userPreference: UserPreferenceService,
    @Inject(DOCUMENT) public document: any,
    public snackBar: MatSnackBar,
    public translate: TranslateService,
    public pricingStore: PricingStore,
    public router: Router,
    protected store: AppStore,
    public pricingService: PricingService
  ) {
    super(
      userCan, quoteEditService, uiConfig, dialogService, assetService, window,
      userPreference, document, snackBar, translate, pricingStore, store, pricingService
    );
    this.uiConfig.get('quoteComment').take(1).subscribe((config: any) => this.commentFormConfig = config.config.form.items);
    this.commentParentObject = { objectType: 'quote', objectId: this.quoteEditService.quoteId };
    this.projectSubscription = this.quoteEditService.projects.subscribe(projects => this.projects = projects);
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

  public onNotification(message: WzEvent): void {
    switch (message.type) {
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

      case 'REMOVE_COST_MULTIPLIER':
        this.removeCostMultiplierFrom(message.payload);
        break;

      case 'OPEN_BULK_IMPORT_DIALOG':
        this.onOpenBulkImportDialog(message.payload);
        break;

      case 'ADD_CUSTOM_PRICE':
        this.onAddCustomPriceTo(message.payload);
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

  public get shouldShowCloneButton(): Observable<boolean> {
    return this.userCan.cloneQuote(this.quoteEditService.data);
  }

  public toggleCommentsVisibility(): void {
    this.showComments = !this.showComments;
  }

  public get commentCount(): Observable<number> {
    return this.store.select(state => state.comment.quote.pagination.totalCount);
  }

  public get purchaseTypeConfig(): MdSelectOption[] {
    return this.config.quotePurchaseType.items;
  }

  public onSelectQuoteType(event: { type: QuoteType }): void {
    this.quoteType = event.type;
    this.config.createQuote.items.map((item: FormFields) => {
      if (item.name === 'purchaseType') {
        item.value = this.viewValueFor(event.type);
      }
      return item;
    });
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

  public onOpenQuoteDialog(): void {
    this.dialogService.openFormDialog(
      this.config.createQuote.items,
      { title: 'QUOTE.CREATE_HEADER', submitLabel: 'QUOTE.SEND_BTN', autocomplete: 'off' },
      this.onSubmitQuoteDialog
    );
  }

  public onOpenDeleteQuoteDialog(): void {
    this.dialogService.openConfirmationDialog({
      title: 'QUOTE.DELETE.TITLE',
      message: 'QUOTE.DELETE.MESSAGE',
      accept: 'QUOTE.DELETE.ACCEPT',
      decline: 'QUOTE.DELETE.DECLINE'
    }, this.deleteQuote);
  }

  public onCloneQuote() {
    this.quoteEditService.cloneQuote(this.quoteEditService.state.data)
      .do(() => this.showSnackBar({ key: 'QUOTE.CLONE_SUCCESS' }))
      .subscribe();
  }

  public onCreateQuote() {
    this.quoteEditService.createQuote()
      .do(() => this.showSnackBar({ key: 'QUOTE.QUOTE_CREATED_PREVIOUS_SAVED' }))
      .subscribe();
  }

  public onOpenBulkImportDialog(projectId: string): void {
    this.dialogService.openFormDialog(
      this.config.bulkImport.items,
      { title: 'QUOTE.BULK_IMPORT.TITLE', submitLabel: 'QUOTE.BULK_IMPORT.SUBMIT_BTN', autocomplete: 'off' },
      (form: { lineItemAttributes: string }) => {
        this.quoteEditService.bulkImport(form, projectId).do(() => {
          this.showSnackBar({
            key: 'QUOTE.BULK_IMPORT.CONFIRMATION',
            value: { numOfAssets: form.lineItemAttributes.split('\n').length }
          });
        }).subscribe();
      }
    );
  }

  public onAddCustomPriceTo(lineItem: AssetLineItem): void {
    this.dialogService.openFormDialog(
      [{
        name: 'price',
        label: 'Price',
        value: String(lineItem.grossAssetPrice),
        type: 'number',
        min: '0',
        validation: 'GREATER_THAN'
      }],
      { title: 'QUOTE.ADD_CUSTOM_PRICE_TITLE', submitLabel: 'QUOTE.ADD_CUSTOM_PRICE_SUBMIT', autocomplete: 'off' },
      (form: { price: number }) => {
        this.store.dispatch(factory => factory.quoteEdit.addCustomPriceToLineItem(lineItem, form.price));
      });
  }

  private updateQuoteField = (options: any): void => {
    this.quoteEditService.updateQuoteField(options);
  }

  private onSubmitQuoteDialog = (form: QuoteOptions): void => {
    this.sendQuote({
      ownerEmail: form.ownerEmail,
      expirationDate: new Date(form.expirationDate).toISOString(),
      purchaseType: form.purchaseType.split(' ').join(''),
      offlineAgreementId: form.offlineAgreementId
    });
  }

  private sendQuote(options: QuoteOptions): void {
    this.quoteEditService.sendQuote(options)
      .do(() => {
        this.router.navigate([`/quotes/${this.quoteEditService.quoteId}`]);
        this.showSnackBar({
          key: 'QUOTE.CREATED_FOR_TOAST',
          value: { emailAddress: options.ownerEmail }
        });
      }).subscribe();
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
      this.costMultiplierFormItems(lineItem),
      { title: this.costMultiplierFormTitle(lineItem), submitLabel: this.costMultiplierFormSubmitLabel(lineItem) },
      (result: { multiplier: string }): void => this.quoteEditService.editLineItem(lineItem, result)
    );
  }

  private costMultiplierFormItems(lineItem: AssetLineItem): Array<FormFields> {
    return lineItem.multiplier > 1 ?
      [Object.assign({}, this.config.addCostMultiplier.items[0], { value: lineItem.multiplier })] :
      this.config.addCostMultiplier.items;
  }

  private costMultiplierFormTitle(lineItem: AssetLineItem): string {
    return lineItem.multiplier > 1 ? 'QUOTE.EDIT_MULTIPLIER_TITLE' : 'QUOTE.ADD_MULTIPLIER_TITLE';
  }

  private costMultiplierFormSubmitLabel(lineItem: AssetLineItem): string {
    return lineItem.multiplier > 1 ? 'QUOTE.EDIT_MULTIPLIER_FORM_SUBMIT' : 'QUOTE.ADD_MULTIPLIER_FORM_SUBMIT';
  }

  private removeCostMultiplierFrom(lineItem: AssetLineItem): void {
    this.quoteEditService.editLineItem(lineItem, { multiplier: 1 });
  }

  private deleteQuote = (): void => {
    this.store.dispatch(factory => factory.quoteEdit.delete());
  }

  private viewValueFor(quoteType: QuoteType): string {
    switch (quoteType) {
      case 'ProvisionalOrder':
        return 'Provisional Order';
      case 'OfflineAgreement':
        return 'Offline Agreement';
      case 'RevenueOnly':
        return 'Revenue Only';
      default:
        return 'Standard';
    }
  }
}
