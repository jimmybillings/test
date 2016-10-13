import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService, Api, ApiOptions, ApiBody } from '../../shared/services/api.service';
import { CartSummaryService } from '../../shared/services/cart-summary.service';
import { CurrentUser } from '../../shared/services/current-user.model';

import { Project, LineItem } from '../cart.interface';
import { CartStore } from './cart.store';
import { CartUtilities } from './cart.utilities';

@Injectable()
export class CartService {
  constructor(
    private store: CartStore,
    private apiService: ApiService,
    private cartSummaryService: CartSummaryService,
    private currentUser: CurrentUser
  ) { }

  public get data(): Observable<CartStore> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  // Loads the cart and returns just the observable's termination notification,
  // because our subscribers care about the fact that we are complete, but they
  // should be getting the data elsewhere.  Also, we take a detour to add a project
  // if one doesn't exist, which creates a second HTTP call (or just returns
  // a synchronous observable).  Either way, we flatMap() that second call's observable
  // to this one, and the termination notification is delayed until both observables
  // are terminated.  We take the last emitted value only, and map the data out of it.
  // Finally, we call share() to ensure that the do() call happens exactly once instead
  // of once per subscriber.
  public initializeData(): Observable<any> {
    return this.apiService.get2(Api.Orders, 'cart', { loading: true })
      .do(wholeCartResponse => this.store.replaceWith(wholeCartResponse))
      .flatMap(_ => this.addProjectIfNoProjectsExist())
      .takeLast(1)
      .map(_ => { return {}; })
      .share();
  }

  public addProject(): void {
    this.addProjectAndReturnObservable().subscribe();
  }

  public removeProject(project: Project): void {
    this.apiService.delete2(Api.Orders, `cart/project/${project.id}`, { loading: true })
      .subscribe(wholeCartResponse => {
        this.updateCart(wholeCartResponse);
        this.addProjectIfNoProjectsExist().subscribe();
      });
  }

  public updateProject(project: Project): void {
    this.apiService.put2(Api.Orders, 'cart/project', { body: project, loading: true })
      .subscribe(this.updateCart);
  }

  public moveLineItemTo(project: Project, lineItem: LineItem): void {
    this.apiService.put2(Api.Orders, 'cart/move/lineItem', { parameters: { lineItemId: lineItem.id, projectId: project.id }, loading: true })
      .subscribe(this.updateCart);
  }

  public cloneLineItem(lineItem: LineItem): void {
    this.apiService.put2(Api.Orders, 'cart/clone/lineItem', { parameters: { lineItemId: lineItem.id }, loading: true })
      .subscribe(this.updateCart);
  }

  public removeLineItem(lineItem: LineItem): void {
    this.apiService.delete2(Api.Orders, `cart/asset/${lineItem.id}`, { loading: true })
      .subscribe(this.updateCart);
  }

  public purchaseOnCredit(): void {
    alert('NOT YET IMPLEMENTED\nWill create an order from the cart and route you to it.');
  }

  private addProjectIfNoProjectsExist(): Observable<any> {
    return ((this.state.projects || []).length === 0) ? this.addProjectAndReturnObservable() : Observable.of({});
  }

  private addProjectAndReturnObservable(): Observable<any> {
    return this.apiService.post2(Api.Orders, 'cart/project', { body: this.createAddProjectRequestBody(), loading: true })
      .do(this.updateCart)
      .share();
  }

  private createAddProjectRequestBody(): ApiBody {
    let existingNames: Array<string> =
      (this.state.projects || []).map((project: any) => project.name);

    return {
      name: CartUtilities.nextNewProjectNameGiven(existingNames),
      clientName: this.fullName
    };
  }

  private get fullName(): string {
    let userName: string;
    this.currentUser.fullName().take(1).subscribe(fullName => userName = fullName);
    return userName;
  }

  // This is an "instance arrow function", which saves us from having to "bind(this)"
  // every time we use this function as a callback.
  private updateCart = (wholeCartResponse: any): void => {
    this.store.replaceWith(wholeCartResponse);
    this.cartSummaryService.loadCartSummary();
  }
}
