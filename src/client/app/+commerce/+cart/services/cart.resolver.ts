import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CartService } from '../../../shared/services/cart.service';
import { Cart } from '../../../shared/interfaces/commerce.interface';

@Injectable()
export class CartResolver implements Resolve<Cart> {
  constructor(private cartService: CartService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cart> {
    return this.cartService.initializeData();
  }
}
