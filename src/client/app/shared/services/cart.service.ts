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
  OrderableType,
  PaymentType,
  PaymentOptions,
  PaymentOption,
  AddressPurchaseOptions,
  CreditCardPurchaseOptions,
  PurchaseOptions,
  LicenseAgreements
} from '../interfaces/commerce.interface';
import { SelectedPriceAttribute, Pojo } from '../interfaces/common.interface';
import { Frame } from '../modules/wazee-frame-formatter/index';
import { enhanceAsset } from '../interfaces/enhanced-asset';
import { Common } from '../utilities/common.functions';

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
    return this.data.map((state: CartState) => Common.clone(state.data));
  }

  public get projects(): Observable<Project[]> {
    return this.cart.map((data: Cart) => {
      return data.projects.map((project: Project) => {
        if (project.lineItems) {
          project.lineItems = project.lineItems.map((lineItem: AssetLineItem) => {
            lineItem.asset = enhanceAsset(Object.assign(lineItem.asset, { uuid: lineItem.id }), 'cartAsset');
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

  public get paymentType(): Observable<PaymentOption> {
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

  public updateSelectedPaymentType(type: PaymentOption): void {
    this.checkoutStore.updateOrderInProgress('selectedPaymentType', type);
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
        parameters: { projectName: existingProjectNames[existingProjectNames.length - 1], region: 'AAA' },
        loadingIndicator: true
      }
    ).subscribe(cartResponse => {
      this.replaceCartWith(cartResponse);
      this.store.dispatch(
        factory => factory.snackbar.display('ASSET.ADD_TO_CART_TOAST', { assetId: addAssetParameters.lineItem.asset.assetId })
      );
    });
  }

  public updateProject(project: Project): void {
    this.api.put(Api.Orders, 'cart/project', { body: project, loadingIndicator: true })
      .subscribe(this.replaceCartWith);
  }

  public updateProjectPriceAttributes(priceAttributes: Array<SelectedPriceAttribute>, project: Project) {
    this.api.put(
      Api.Orders,
      `cart/project/priceAttributes/${project.id}`,
      { body: this.format(priceAttributes), loadingIndicator: true }
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
      fieldToEdit = { attributes: fieldToEdit.pricingAttributes };
    }

    Object.assign(lineItem, fieldToEdit);

    this.api.put(Api.Orders,
      `cart/update/lineItem/${lineItem.id}`,
      { body: lineItem, parameters: { region: 'AAA' }, loadingIndicator: true }
    ).subscribe(this.replaceCartWith);
  }

  public editLineItemMarkers(lineItem: AssetLineItem, newMarkers: SubclipMarkersInterface.SubclipMarkers): void {
    const duration: SubclipMarkersInterface.Duration = SubclipMarkersInterface.durationFrom(newMarkers);

    Object.assign(lineItem.asset, duration);

    this.editLineItem(lineItem, {});
  }

  public getPaymentOptions() {
    this.api.get(Api.Orders, 'cart/paymentOptions').subscribe((options: PaymentOptions) => {
      this.updateOrderInProgress('paymentOptions', options);
      if (options.paymentOptions.length === 1) this.updateSelectedPaymentType(options.paymentOptions[0]);
    });
  }

  public updateOrderInProgress(type: string, data: any): void {
    this.checkoutStore.updateOrderInProgress(type, data);
  }

  public paymentOptionsEqual(options: Array<PaymentOption>): Observable<boolean> {
    return this.paymentOptions.map((pmtOpts: PaymentOptions) => {
      if (!pmtOpts) return false;
      pmtOpts.paymentOptions.sort();
      return options.length === pmtOpts.paymentOptions.length &&
        options.sort().every((option: PaymentOption, index: number) => option === pmtOpts.paymentOptions[index]);
    });
  }

  public retrieveLicenseAgreements(): Observable<LicenseAgreements> {
    return this.api.get(Api.Orders, 'cart/licensing', { loadingIndicator: true });
  }

  // Private methods

  private purchaseWithCreditCard(): Observable<number> {
    const options: PurchaseOptions = this.purchaseOptions;
    return this.api.post(Api.Orders, 'cart/stripe/process', { body: { options }, loadingIndicator: true })
      .do(() => this.store.dispatch(factory => factory.order.setCheckoutState(true)));
  }

  private purchaseOnCredit(): Observable<number> {
    const options: AddressPurchaseOptions = this.addressPurchaseOptions;
    return this.api.post(Api.Orders, 'cart/checkout/purchaseOnCredit', { body: { options }, loadingIndicator: true })
      .do(() => this.store.dispatch(factory => factory.order.setCheckoutState(true)))
      .map((order: Order) => order.id);
  }

  private formatBody(parameters: AddAssetParameters): any {
    let formatted = {};
    Object.assign(formatted, { lineItem: this.formatLineItem(parameters.lineItem, parameters.markers) });
    if (parameters.attributes) {
      Object.assign(formatted, { attributes: parameters.attributes });
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

  // Should be able to deprecate this when the BE accepts all SelectedPriceAttribute props on project rights package updates
  private format(attributes: SelectedPriceAttribute[]): Pojo {
    return attributes.reduce((formatted: Pojo, attribute: SelectedPriceAttribute) => {
      formatted[attribute.priceAttributeName] = attribute.selectedAttributeValue;
      return formatted;
    }, {});
  }
}
