import { Component, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { Tab } from './tab';

@Component({
  moduleId: module.id,
  selector: 'confirm-tab-component',
  templateUrl: 'confirm-tab.html'
})

export class ConfirmTabComponent extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  constructor(private cartService: CartService) {
    super();
  }

  purchase() {
    this.cartService.purchase().subscribe(() =>
      this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' })
      , (error: any) =>
        console.log(error)
    );
  }
}
