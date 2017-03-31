import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'commerce-list',
  templateUrl: 'commerce-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommerceListComponent {
  @Input() items: any;
  @Input() type: 'ORDER' | 'QUOTE';
  @Input() userCanAdministerQuotes: boolean;
  @Output() setAsFocusedQuote: EventEmitter<any> = new EventEmitter();
  @Output() editQuote: EventEmitter<any> = new EventEmitter();

  public shouldShowSetFocusedButton(item: any): boolean {
    return this.type === 'QUOTE' && item.quoteStatus === 'PENDING' && this.userCanAdministerQuotes;
  }

  public shouldShowEditQuoteButton(item: any): boolean {
    return this.type === 'QUOTE' && item.quoteStatus === 'PENDING' && this.userCanAdministerQuotes;
  }

  public shouldShowViewQuoteButton(item: any): boolean {
    return this.type === 'QUOTE' && item.quoteStatus !== 'PENDING';
  }

  public get shouldShowViewOrderButton(): boolean {
    return this.type === 'ORDER';
  }
}
