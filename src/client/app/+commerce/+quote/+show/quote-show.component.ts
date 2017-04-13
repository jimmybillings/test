import { Component, OnInit } from '@angular/core';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { QuoteService } from '../../../shared/services/quote.service';
import { Quote } from '../../../shared/interfaces/commerce.interface';
import { Observable } from 'rxjs/Observable';
import { CommerceMessage } from '../../../shared/interfaces/commerce.interface';

@Component({
  moduleId: module.id,
  selector: 'quote-show-component',
  templateUrl: 'quote-show.html'
})

export class QuoteShowComponent implements OnInit {
  public tabLabelKeys: string[];
  public tabEnabled: boolean[];
  public selectedTabIndex: number;
  public quote: Observable<Quote>;

  constructor(public userCan: CommerceCapabilities, public quoteService: QuoteService) {
    this.quote = this.quoteService.data.map(state => state.data);
  }

  ngOnInit() {
    this.tabLabelKeys = ['quote', 'billing', 'payment', 'confirm'];

    // Enable the first tab and disable the rest.
    this.tabEnabled = this.tabLabelKeys.map((_, index) => index === 0);

    this.selectedTabIndex = 0;
  }

  public get hasPurchaseType(): boolean {
    return !!this.quoteService.state.data.purchaseType;
  }

  public get shouldDisplayReview(): boolean {
    return this.userCan.administerQuotes() || this.quoteService.state.data.quoteStatus !== 'ACTIVE';
  }

  public get shouldDisplayPurchaseHeader(): boolean {
    return !this.userCan.administerQuotes() && this.quoteService.state.data.quoteStatus === 'ACTIVE';
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
    }
  }

  private goToNextTab(): void {
    let nextSelectedTabIndex: number = this.selectedTabIndex + 1;
    if (nextSelectedTabIndex >= this.tabLabelKeys.length) return;

    this.tabEnabled[nextSelectedTabIndex] = true;

    // Ick!  Have to wait for the tab to be enabled before we can select it.
    // TODO: There must be a better way...
    setTimeout(_ => this.selectedTabIndex = nextSelectedTabIndex, 50);
  }

  private goToPreviousTab(): void {
    if (this.selectedTabIndex === 0) return;
    this.selectedTabIndex -= 1;
  }
}
