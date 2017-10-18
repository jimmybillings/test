import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { QuoteService } from '../../../shared/services/quote.service';
import { Quote, QuoteState, AssetLineItem, QuoteType } from '../../../shared/interfaces/commerce.interface';
import { Observable } from 'rxjs/Observable';
import { CommerceMessage } from '../../../shared/interfaces/commerce.interface';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { CommentParentObject } from '../../../shared/interfaces/comment.interface';
import { AppStore } from '../../../app.store';

@Component({
  moduleId: module.id,
  selector: 'quote-show-component',
  templateUrl: 'quote-show.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteShowComponent implements OnInit {
  public tabLabelKeys: string[];
  public tabEnabled: boolean[];
  public selectedTabIndex: number;
  public quote: Observable<Quote>;
  public commentFormConfig: Array<FormFields>;
  public commentParentObject: CommentParentObject;
  public showComments: boolean = null;

  constructor(
    public userCan: CommerceCapabilities,
    public quoteService: QuoteService,
    private store: AppStore,
    private detector: ChangeDetectorRef
  ) {
    this.quote = this.quoteService.data.map(state => state.data);
  }

  ngOnInit() {
    this.tabLabelKeys = ['quote', 'billing', 'payment', 'confirm'];

    // Enable the first tab and disable the rest.
    this.tabEnabled = this.tabLabelKeys.map((_, index) => index === 0);

    this.selectedTabIndex = 0;

    this.commentFormConfig = this.store.snapshotCloned(state => state.uiConfig.components.quoteComment.config.form.items);

    this.commentParentObject = { objectType: 'quote', objectId: this.quoteService.state.data.id };
  }

  public get hasPurchaseType(): boolean {
    return !!this.quoteService.state.data.purchaseType;
  }

  public get hasDiscount(): boolean {
    return !!this.quoteService.state.data.discount;
  }

  public get isExpired(): boolean {
    return this.quoteService.state.data.quoteStatus === 'EXPIRED';
  }

  public get shouldDisplayReview(): boolean {
    return this.userCan.administerQuotes() || this.quoteService.state.data.quoteStatus !== 'ACTIVE';
  }

  public get shouldDisplayPurchaseHeader(): boolean {
    return !this.userCan.administerQuotes() && this.quoteService.state.data.quoteStatus === 'ACTIVE';
  }

  public get shouldShowRecipientInfo(): boolean {
    return this.userCan.administerQuotes();
  }

  public get trStringForPurchaseType(): string {
    return `QUOTE.${this.hasPurchaseType ? this.quoteService.state.data.purchaseType : 'Standard'}`;
  }

  public onNotification(message: CommerceMessage): void {
    switch (message.type) {
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

  public toggleCommentsVisibility(): void {
    this.showComments = !this.showComments;
  }

  public get commentCount(): Observable<number> {
    return this.store.select(state => state.comment.quote.pagination.totalCount);
  }

  public get offlineAgreementIds(): Observable<string> {
    return this.quoteService.data.map((data: QuoteState) => {
      let ids: string[] = [];
      data.data.projects.forEach(project => project.lineItems.forEach((lineItem: AssetLineItem) => {
        if (lineItem.externalAgreementIds) lineItem.externalAgreementIds.forEach(id => ids.push(id));
      }));
      return ids.filter((id: string, index: number, ids: string[]) => id !== ids[index - 1]).join(', ');
    });
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

  private disableTab(tabIndex: number) {
    this.tabEnabled[tabIndex] = false;
    this.detector.markForCheck();
  }

  private goToTab(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
    this.detector.markForCheck();
  }
}
