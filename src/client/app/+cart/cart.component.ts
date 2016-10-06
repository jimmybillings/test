import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'cart-component',
  templateUrl: 'cart.html'
})

export class CartComponent implements OnInit {
  public tabLabelKeys: string[];
  public tabEnabled: boolean[];
  public selectedTabIndex: number = 0;

  ngOnInit() {
    // We could initialize a subset of these instead, based on some condition.
    // For example, don't include 'billing' and 'payment' if the cart total is 0.
    this.tabLabelKeys = ['cart', 'review', 'billing', 'payment', 'confirm'];

    // Enable the first tab and disable the rest.
    this.tabEnabled = this.tabLabelKeys.map((_, index) => index === 0);
  }

  public onNotification(message: any): void {
    switch(message.type) {
      case 'GO_TO_NEXT_TAB': {
        this.goToNextTab();
        break;
      }
    }
  }

  private goToNextTab():void {
    let nextSelectedTabIndex: number = this.selectedTabIndex + 1;
    this.tabEnabled[nextSelectedTabIndex] = true;

    // Ick!  Have to wait for the tab to be enabled before we can select it.
    // TODO: There must be a better way...
    setTimeout(_ => this.selectedTabIndex = nextSelectedTabIndex, 50);
  }
}
