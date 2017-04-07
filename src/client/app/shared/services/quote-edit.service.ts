import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { Api, ApiBody } from '../interfaces/api.interface';
import { CurrentUserService } from '../services/current-user.service';
import { Address, ViewAddress } from '../interfaces/user.interface';

import { Project, LineItem, AddAssetParameters } from '../interfaces/cart.interface';
import { CartStore } from '../stores/cart.store';
import { Cart, CartState } from '../interfaces/cart.interface';

import { QuoteOptions } from '../../shared/interfaces/quote.interface';

@Injectable()
export class QuoteEditService {
  constructor(
    private store: CartStore,
    private api: ApiService,
    private currentUser: CurrentUserService
  ) { }

  public get data(): Observable<CartStore> {
    return this.store.data;
  }

  public get state(): CartState {
    return this.store.state;
  }

  public get cart(): Observable<Cart> {
    return this.data.map((data: any) => data.cart);
  }

  public get projects(): Observable<Project[]> {
    return this.cart.map((data: Cart) => data.projects);
  }

  public get total(): Observable<Number> {
    return this.cart.map((data: Cart) => data.total);
  }

  public get hasAssets(): Observable<boolean> {
    return this.cart.map(cart => (cart.itemCount || 0) > 0);
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
    return this.api.get(Api.Orders, 'cart', { loading: true })
      .do(this.replaceCartWith)
      .takeLast(1)
      .map(_ => { return {}; })
      .share();
  }

  // Temporary until first time user's cart is created with a project - fix for CRUX-1027
  public getCartSummary(): void {
    this.api.get(Api.Orders, 'cart/summary')
      .subscribe((cartSummary: any) => this.updateCartWith(cartSummary));
  }

  public purchase(): Observable<any> {
    const stripe: any = {
      stripeToken: this.state.orderInProgress.authorization.id,
      stripeTokenType: this.state.orderInProgress.authorization.type
    };
    return this.api.post(Api.Orders, 'cart/stripe/process',
      { body: stripe, loading: true })
      .do((response: any) => {
        this.initializeData().subscribe();
        return response;
      });
  }

  public addProject(): void {
    this.addProjectAndReturnObservable().subscribe();
  }

  public removeProject(project: Project): void {
    this.api.delete(Api.Orders, `cart/project/${project.id}`, { loading: true })
      .subscribe(wholeCartResponse => {
        this.replaceCartWith(wholeCartResponse);
      });
  }

  public addAssetToProjectInCart(addAssetParameters: AddAssetParameters): void {
    let existingProjectNames: Array<string> = this.existingProjectNames;
    this.api.put(
      Api.Orders,
      'cart/asset/lineItem/quick',
      {
        body: this.formatAssetBody(addAssetParameters),
        parameters: { projectName: existingProjectNames[existingProjectNames.length - 1], region: 'AAA' }
      }
    ).subscribe(this.replaceCartWith);
  }

  public updateProject(project: Project): void {
    this.api.put(Api.Orders, 'cart/project', { body: project, loading: true })
      .subscribe(this.replaceCartWith);
  }

  public moveLineItemTo(project: Project, lineItem: LineItem): void {
    this.api.put(Api.Orders, 'cart/move/lineItem', { parameters: { lineItemId: lineItem.id, projectId: project.id }, loading: true })
      .subscribe(this.replaceCartWith);
  }

  public cloneLineItem(lineItem: LineItem): void {
    this.api.put(Api.Orders, 'cart/clone/lineItem', { parameters: { lineItemId: lineItem.id }, loading: true })
      .subscribe(this.replaceCartWith);
  }

  public removeLineItem(lineItem: LineItem): void {
    this.api.delete(Api.Orders, `cart/asset/${lineItem.id}`, { loading: true })
      .subscribe(this.replaceCartWith);
  }

  public purchaseOnCredit(): Observable<any> {
    return this.api.post(Api.Orders, 'cart/checkout/purchaseOnCredit', { loading: true }).do(() => {
      this.initializeData().subscribe();
    });
  }

  public editLineItem(lineItem: LineItem, fieldToEdit: any): void {
    if (!!fieldToEdit.pricingAttributes) {
      fieldToEdit = { attributes: this.formatAttributes(fieldToEdit.pricingAttributes) };
    }
    Object.assign(lineItem, fieldToEdit);
    this.api.put(Api.Orders, `cart/update/lineItem/${lineItem.id}`, { body: lineItem, parameters: { region: 'AAA' } })
      .subscribe(this.replaceCartWith);
  }

  public createQuote(options: QuoteOptions): Observable<any> {
    return this.store.data.flatMap((cartStore: any) => {
      let body: any = this.formatQuoteBody(cartStore.cart, options);
      return this.api.post(Api.Orders, 'quote', { body: body });
    });
  }

  public updateOrderInProgress(type: string, data: any): void {
    this.store.updateOrderInProgress(type, data);
  }

  private formatAssetBody(parameters: AddAssetParameters): any {
    let formatted = {};
    Object.assign(formatted, { lineItem: parameters.lineItem });
    if (parameters.attributes) {
      Object.assign(formatted, { attributes: this.formatAttributes(parameters.attributes) });
    }
    return formatted;
  }

  private formatAttributes(attributes: any): Array<any> {
    let formatted: Array<any> = [];
    for (let attr in attributes) {
      formatted.push({ priceAttributeName: attr, selectedAttributeValue: attributes[attr] });
    }
    return formatted;
  }

  private addProjectAndReturnObservable(): Observable<any> {
    return this.api.post(Api.Orders, 'cart/project', { body: { clientName: this.fullName }, loading: true })
      .do(this.replaceCartWith)
      .share();
  }

  private get fullName(): string {
    let userName: string;
    this.currentUser.fullName().take(1).subscribe(fullName => userName = fullName);
    return userName;
  }

  private get existingProjectNames(): Array<string> {
    return (this.state.cart.projects || []).map((project: any) => project.name);
  }

  private formatQuoteBody(cart: Cart, options: QuoteOptions): any {
    // We don't want to send 'standard' to the API, as it's not a valid option.
    // we leave it blank so the end user can decide later to pay with credit-card or purchase on credit
    if (options.purchaseType === 'standard') delete options.purchaseType;

    // find the userId of the user that this quote is for
    let ownerUserId: number = options.users ? options.users.filter((user: any) => {
      return user.emailAddress === options.emailAddress;
    })[0].id : null;

    // shove the extra quote params on to the current cart
    let body: any = Object.assign(
      cart,
      { quoteStatus: options.status, purchaseType: options.purchaseType, expirationDate: options.expirationDate }
    );

    // add the user id if it exists
    if (ownerUserId) Object.assign(body, { ownerUserId });

    // delete the fields leftover from the cart store
    delete body.id;
    delete body.createdOn;
    delete body.lastUpdated;

    return body;
  }

  // This is an "instance arrow function", which saves us from having to "bind(this)"
  // every time we use this function as a callback.
  private replaceCartWith = (wholeCartResponse: any): void => {
    this.store.replaceCartWith(wholeCartResponse);
  }

  private updateCartWith = (cartSummary: any): void => {
    this.store.updateCartWith(cartSummary);
  }

}
