import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { CartService } from '../../../shared/services/cart.service';

@Injectable()
export class CartResolver implements Resolve<any> {
  constructor(private cartService: CartService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.cartService.initializeData();
  }
}
