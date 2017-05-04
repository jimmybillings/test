import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CartService } from '../../../shared/services/cart.service';
import { CartState } from '../../../shared/interfaces/commerce.interface';

@Injectable()
export class CartResolver implements Resolve<CartState> {
  constructor(private cartService: CartService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CartState> {
    return this.cartService.data.filter((cart: CartState) => this.cartService.loaded).take(1);
  }
}
