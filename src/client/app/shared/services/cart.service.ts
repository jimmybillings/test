import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { Api, ApiBody } from '../interfaces/api.interface';
import { CurrentUserService } from '../services/current-user.service';
import { Address, ViewAddress } from '../interfaces/user.interface';
import * as SubclipMarkersInterface from '../interfaces/subclip-markers';
import { AppStore, CartState } from '../../app.store';
import { CheckoutStore } from '../stores/checkout.store';
import {
  Order,
  Cart,
  Project,
  AssetLineItem,
  AddAssetParameters,
  QuoteOptions,
  CheckoutState,
  OrderType,
  PaymentOptions,
  AddressPurchaseOptions,
  CreditCardPurchaseOptions,
  PurchaseOptions,
  LicenseAgreements
} from '../interfaces/commerce.interface';
import { SelectedPriceAttributes } from '../interfaces/common.interface';
import { Frame } from 'wazee-frame-formatter';
import { enhanceAsset } from '../interfaces/enhanced-asset';

@Injectable()
export class CartService {
  constructor(
    private store: AppStore,
    private checkoutStore: CheckoutStore,
    private api: ApiService,
    private currentUser: CurrentUserService
  ) { }

  public get data(): Observable<CartState> {
    return this.store.select(state => state.cart);
  }

  public get state(): CartState {
    return this.store.snapshot(state => state.cart);
  }

  public get checkoutState(): CheckoutState {
    return this.checkoutStore.state;
  }

  public get checkoutData(): Observable<CheckoutState> {
    return this.checkoutStore.data;
  }

  public get cart(): Observable<Cart> {
    return this.data.map((state: CartState) => state.data);
  }

  public get projects(): Observable<Project[]> {
    return this.cart.map((data: Cart) => {
      return data.projects.map((project: Project) => {
        if (project.lineItems) {
          project.lineItems = project.lineItems.map((lineItem: AssetLineItem) => {
            lineItem.asset = enhanceAsset(
              Object.assign(lineItem.asset, { uuid: lineItem.id }),
              { type: 'cartAsset' }
            );
            return lineItem;
          });
        }
        return project;
      });
    });
  }

  public get total(): Observable<Number> {
    return this.cart.map((data: Cart) => data.total);
  }

  public get hasAssets(): Observable<boolean> {
    return this.cart.map(cart => (cart.itemCount || 0) > 0);
  }

  public get paymentType(): Observable<OrderType> {
    return this.checkoutData.map((state: CheckoutState) => state.selectedPaymentType);
  }

  public get loaded(): boolean {
    return !isNaN(this.state.data.userId);
  }

  public get paymentOptions(): Observable<PaymentOptions> {
    return this.checkoutData.map((data: CheckoutState) => data.paymentOptions);
  }

  public get hasAssetLineItems(): Observable<boolean> {
    return this.cart.map((cart: Cart) => {
      return cart.projects.reduce((previous: number, current: Project) => {
        return current.lineItems ? previous += current.lineItems.length : 0;
      }, 0) > 0;
    });
  }

  public purchase(): Observable<number> {
    switch (this.checkoutState.selectedPaymentType) {
      case 'CreditCard':
        return this.purchaseWithCreditCard();
      case 'PurchaseOnCredit':
        return this.purchaseOnCredit();
      default:
        return Observable.of(NaN);
    }
  }

  public addProject(): void {
    this.addProjectAndReturnObservable().subscribe();
  }

  public removeProject(project: Project): void {
    this.api.delete(Api.Orders, `cart/project/${project.id}`, { loadingIndicator: true })
      .subscribe(wholeCartResponse => {
        this.replaceCartWith(wholeCartResponse);
      });
  }

  public addAssetToProjectInCart(addAssetParameters: AddAssetParameters): void {
    let existingProjectNames: Array<string> = this.existingProjectNames;
    this.api.put(
      Api.Orders,
      'cart/asset/lineItem',
      {
        body: this.formatBody(addAssetParameters),
        parameters: { projectName: existingProjectNames[existingProjectNames.length - 1], region: 'AAA' }
      }
    ).subscribe(this.replaceCartWith);
  }

  public updateProject(project: Project): void {
    this.api.put(Api.Orders, 'cart/project', { body: project, loadingIndicator: true })
      .subscribe(this.replaceCartWith);
  }

  public updateProjectPriceAttributes(priceAttributes: SelectedPriceAttributes, project: Project) {
    this.api.put(
      Api.Orders,
      `cart/project/priceAttributes/${project.id}`,
      { body: priceAttributes, loadingIndicator: true }
    ).subscribe(this.replaceCartWith);
  }

  public moveLineItemTo(project: Project, lineItem: AssetLineItem): void {
    this.api.put(
      Api.Orders,
      'cart/move/lineItem',
      { parameters: { lineItemId: lineItem.id, projectId: project.id }, loadingIndicator: true }
    ).subscribe(this.replaceCartWith);
  }

  public cloneLineItem(lineItem: AssetLineItem): void {
    this.api.put(Api.Orders, 'cart/clone/lineItem', { parameters: { lineItemId: lineItem.id }, loadingIndicator: true })
      .subscribe(this.replaceCartWith);
  }

  public removeLineItem(lineItem: AssetLineItem): void {
    this.api.delete(Api.Orders, `cart/asset/${lineItem.id}`, { loadingIndicator: true })
      .subscribe(this.replaceCartWith);
  }

  public editLineItem(lineItem: AssetLineItem, fieldToEdit: any): void {
    if (!!fieldToEdit.pricingAttributes) {
      fieldToEdit = { attributes: this.formatAttributes(fieldToEdit.pricingAttributes) };
    }
    Object.assign(lineItem, fieldToEdit);
    this.api.put(Api.Orders, `cart/update/lineItem/${lineItem.id}`, { body: lineItem, parameters: { region: 'AAA' } })
      .subscribe(this.replaceCartWith);
  }

  public editLineItemMarkers(lineItem: AssetLineItem, newMarkers: SubclipMarkersInterface.SubclipMarkers): void {
    const duration: SubclipMarkersInterface.Duration = SubclipMarkersInterface.durationFrom(newMarkers);

    Object.assign(lineItem.asset, duration);

    this.editLineItem(lineItem, {});
  }

  public getPaymentOptions() {
    this.api.get(Api.Orders, 'cart/paymentOptions').subscribe((options: PaymentOptions) => {
      this.updateOrderInProgress('paymentOptions', options);
      if (options.paymentOptions.length === 1) this.updateOrderInProgress('selectedPaymentType', options.paymentOptions[0]);
    });
  }

  public updateOrderInProgress(type: string, data: any): void {
    this.checkoutStore.updateOrderInProgress(type, data);
  }

  public paymentOptionsEqual(options: Array<OrderType>): Observable<boolean> {
    return this.paymentOptions.map((pmtOpts: PaymentOptions) => {
      if (!pmtOpts) return false;
      pmtOpts.paymentOptions.sort();
      return options.length === pmtOpts.paymentOptions.length &&
        options.sort().every((option: OrderType, index: number) => option === pmtOpts.paymentOptions[index]);
    });
  }

  public retrieveLicenseAgreements(): Observable<LicenseAgreements> {
    return this.api.get(Api.Orders, 'cart/licensing');
  }

  // Private methods

  private purchaseWithCreditCard(): Observable<number> {
    const options: PurchaseOptions = this.purchaseOptions;
    return this.api.post(Api.Orders, 'cart/stripe/process', { body: { options }, loadingIndicator: true })
      .do(() => this.store.dispatch(factory => factory.cart.load()));
  }

  private purchaseOnCredit(): Observable<number> {
    const options: AddressPurchaseOptions = this.addressPurchaseOptions;
    return this.api.post(Api.Orders, 'cart/checkout/purchaseOnCredit', { body: { options }, loadingIndicator: true })
      .do(() => this.store.dispatch(factory => factory.cart.load()))
      .map((order: Order) => order.id);
  }

  private formatBody(parameters: AddAssetParameters): any {
    let formatted = {};
    Object.assign(formatted, { lineItem: this.formatLineItem(parameters.lineItem, parameters.markers) });
    if (parameters.attributes) {
      Object.assign(formatted, { attributes: this.formatAttributes(parameters.attributes) });
    }
    return formatted;
  }

  private formatLineItem(lineItem: any, markers: SubclipMarkersInterface.SubclipMarkers): any {
    return Object.assign({}, lineItem, { asset: this.formatAsset(lineItem.asset, markers) });
  }

  private formatAsset(asset: any, markers: SubclipMarkersInterface.SubclipMarkers): any {
    let timeStart: number;
    let timeEnd: number;

    if (markers) {
      const duration: SubclipMarkersInterface.Duration = SubclipMarkersInterface.durationFrom(markers);
      timeStart = duration.timeStart;
      timeEnd = duration.timeEnd;
    } else {
      timeStart = asset.timeStart;
      timeEnd = asset.timeEnd;
    }

    return { assetId: asset.assetId, timeStart: timeStart >= 0 ? timeStart : -1, timeEnd: timeEnd >= 0 ? timeEnd : -2 };
  }

  private formatAttributes(attributes: any): Array<any> {
    let formatted: Array<any> = [];
    for (let attr in attributes) {
      formatted.push({ priceAttributeName: attr, selectedAttributeValue: attributes[attr] });
    }
    return formatted;
  }

  private addProjectAndReturnObservable(): Observable<any> {
    return this.api.post(Api.Orders, 'cart/project', { body: { clientName: this.fullName }, loadingIndicator: true })
      .do(this.replaceCartWith)
      .share();
  }

  private get fullName(): string {
    let userName: string;
    this.currentUser.fullName().take(1).subscribe(fullName => userName = fullName);
    return userName;
  }

  private get existingProjectNames(): Array<string> {
    return (this.state.data.projects || []).map((project: any) => project.name);
  }

  // This is an "instance arrow function", which saves us from having to "bind(this)"
  // every time we use this function as a callback.
  private replaceCartWith = (wholeCartResponse: any): void => {
    // dispatching a loadSuccess here.. eventually, we can refactor this when the whole cart is migrated to effects
    this.store.dispatch(factory => factory.cart.loadSuccess(wholeCartResponse));
  }

  private get purchaseOptions(): PurchaseOptions {
    return Object.assign({}, this.addressPurchaseOptions, this.creditCardPurchaseOptions) as PurchaseOptions;
  }

  private get addressPurchaseOptions(): AddressPurchaseOptions {
    return {
      orderAddressId: this.checkoutState.selectedAddress.addressEntityId,
      orderAddressType: this.checkoutState.selectedAddress.type
    };
  }

  private get creditCardPurchaseOptions(): CreditCardPurchaseOptions {
    return {
      stripeToken: this.checkoutState.authorization.id,
      stripeTokenType: this.checkoutState.authorization.type
    };
  }
}
