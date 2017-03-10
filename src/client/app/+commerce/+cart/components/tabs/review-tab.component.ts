import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { OrderStore } from '../../../../shared/stores/order.store';
import { Tab } from './tab';
import { CartService } from '../../../../shared/services/cart.service';
import { CartCapabilities } from '../../services/cart.capabilities';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';
declare var baseUrl: any;

@Component({
  moduleId: module.id,
  selector: 'review-tab-component',
  templateUrl: 'review-tab.html'
})
export class ReviewTabComponent extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  public cart: Observable<any>;
  public canPurchaseOnCredit: boolean;
  constructor(private cartService: CartService,
    private userCan: CartCapabilities,
    private router: Router,
    private order: OrderStore,
    private snackbar: MdSnackBar,
    private translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.canPurchaseOnCredit = this.userCan.purchaseOnCredit();
  }

  public purchaseOnCredit(): void {
    this.cartService.purchaseOnCredit().subscribe(data => {
      this.order.update(data);
      this.router.navigate(['/commerce/order/' + data.id]).then(() => {
        this.showSnackbar('NOTIFICATION.ORDER_PLACED');
      });
    });
  }

  private showSnackbar(message: any): void {
    this.translate.get(message)
      .subscribe((res: string) => {
        this.snackbar.open(res, '', { duration: 2000 });
      });
  }
}
