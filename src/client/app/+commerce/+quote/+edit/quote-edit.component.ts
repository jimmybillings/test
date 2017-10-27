import { Component, Inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { UserPreferenceService } from '../../../shared/services/user-preference.service';
import { WindowRef } from '../../../shared/services/window-ref.service';
import { QuoteOptions, Project, OrderableType, Quote, AssetLineItem, CommerceMessage } from '../../../shared/interfaces/commerce.interface';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { User } from '../../../shared/interfaces/user.interface';
import { WzEvent } from '../../../shared/interfaces/common.interface';
import { FormFields, MdSelectOption } from '../../../shared/interfaces/forms.interface';
import { CommentParentObject } from '../../../shared/interfaces/comment.interface';
import { AppStore } from '../../../app.store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CommerceEditTab } from '../../components/tabs/commerce-edit-tab';

@Component({
  moduleId: module.id,
  selector: 'quote-edit-component',
  templateUrl: 'quote-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteEditComponent implements OnInit {
  public tabLabelKeys: string[];
  public tabEnabled: boolean[];
  public selectedTabIndex: number;
  public config: any;
  public commentFormConfig: Array<FormFields>;
  public commentParentObject: CommentParentObject;
  public showComments: boolean = null;

  constructor(
    public userCan: Capabilities,
    public quoteEditService: QuoteEditService,
    public dialogService: WzDialogService,
    public window: WindowRef,
    public userPreference: UserPreferenceService,
    protected store: AppStore,
    private detector: ChangeDetectorRef
  ) {
    this.commentFormConfig = this.store.snapshotCloned(state => state.uiConfig.components.quoteComment.config.form.items);
    this.commentParentObject = { objectType: 'quote', objectId: this.quoteEditService.quoteId };
    this.config = this.store.snapshotCloned(state => state.uiConfig.components.cart.config);
  }

  ngOnInit() {
    // We could initialize a subset of these instead, based on some condition.
    // For example, don't include 'billing' and 'payment' if the cart total is 0.
    // this.tabLabelKeys = ['cart', 'billing', 'payment', 'confirm'];
    // I think the confirm tab should be place order
    this.tabLabelKeys = ['active quote', 'send'];

    // Enable the first tab and disable the rest.
    this.tabEnabled = this.tabLabelKeys.map((_, index) => index === 0);

    this.selectedTabIndex = 0;
  }

  public onNotification(message: CommerceMessage): void {
    switch (message.type) {
      case 'OPEN_DELETE_DIALOG':
        this.onOpenDeleteQuoteDialog();
        break;

      case 'SAVE_AND_NEW':
        this.onCreateQuote();
        break;

      case 'CLONE_QUOTE':
        this.onCloneQuote();
        break;

      case 'GO_TO_NEXT_TAB': {
        this.goToNextTab();
        break;
      }
      case 'GO_TO_PREVIOUS_TAB': {
        this.goToPreviousTab();
        break;
      }
      case 'GO_TO_TAB': {
        this.goToTab(message.payload);
        break;
      }
      case 'DISABLE_TAB': {
        this.disableTab(message.payload);
      }
    }
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

  public get shouldShowCloneButton(): Observable<boolean> {
    return this.userCan.cloneQuote(this.quoteEditService.data);
  }

  public toggleCommentsVisibility(): void {
    this.showComments = !this.showComments;
  }

  public get commentCount(): Observable<number> {
    return this.store.select(state => state.comment.quote.pagination.totalCount);
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
      .do(() => this.store.dispatch(factory => factory.snackbar.display('QUOTE.CLONE_SUCCESS')))
      .subscribe();
  }

  public onCreateQuote() {
    this.quoteEditService.createQuote()
      .do(() => this.store.dispatch(factory => factory.snackbar.display('QUOTE.QUOTE_CREATED_PREVIOUS_SAVED')))
      .subscribe();
  }

  private goToNextTab(): void {
    let nextSelectedTabIndex: number = this.selectedTabIndex + 1;
    if (nextSelectedTabIndex >= this.tabLabelKeys.length) return;

    this.tabEnabled[nextSelectedTabIndex] = true;
    this.selectedTabIndex = nextSelectedTabIndex;
    this.detector.markForCheck();
  }

  private goToPreviousTab(): void {
    if (this.selectedTabIndex === 0) return;
    this.selectedTabIndex -= 1;
    this.detector.markForCheck();
  }

  private updateQuoteField = (options: any): void => {
    this.quoteEditService.updateQuoteField(options);
  }

  private disableTab(tabIndex: number) {
    this.tabEnabled[tabIndex] = false;
    this.detector.markForCheck();
  }

  private goToTab(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
    this.detector.markForCheck();
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

  private deleteQuote = (): void => {
    this.store.dispatch(factory => factory.quoteEdit.delete());
  }

}
