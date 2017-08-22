import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api.service';
import { Api, ApiBody, ApiParameters } from '../interfaces/api.interface';
import { Address, ViewAddress } from '../interfaces/user.interface';
import {
  Project,
  AssetLineItem,
  FeeLineItem,
  AddAssetParameters,
  Quote,
  QuoteState,
  QuoteOptions,
  EditableQuoteFields,
  FeeConfig,
  LicenseAgreements
} from '../interfaces/commerce.interface';
import * as SubclipMarkersInterface from '../interfaces/subclip-markers.interface';
import { Frame } from 'wazee-frame-formatter';
import { ActiveQuoteStore } from '../stores/active-quote.store';

import { FeeConfigStore } from '../stores/fee-config.store';
import { SelectedPriceAttributes } from '../interfaces/common.interface';
import { Common } from '../utilities/common.functions';

@Injectable()
export class QuoteEditService {
  constructor(
    private store: ActiveQuoteStore,
    private feeConfigStore: FeeConfigStore,
    private api: ApiService
  ) { }

  // Store Accessors

  public get data(): Observable<QuoteState> {
    return this.store.data;
  }

  public get state(): QuoteState {
    return this.store.state;
  }

  public get quote(): Observable<Quote> {
    return this.data.map((state: QuoteState) => state.data);
  }

  public get projects(): Observable<Project[]> {
    return this.quote.map((data: Quote) => data.projects);
  }

  public get total(): Observable<Number> {
    return this.quote.map((data: Quote) => data.total);
  }

  public get subTotal(): Observable<Number> {
    return this.quote.map((data: Quote) => data.subTotal);
  }

  public get hasAssets(): Observable<boolean> {
    return this.quote.map(quote => (quote.itemCount || 0) > 0);
  }

  public get quoteId(): number {
    return this.state.data.id;
  }

  public hasProperty(prop: string): Observable<string | undefined> {
    return this.quote.map((data: any) => data[prop]);
  }

  public get hasAssetLineItems(): Observable<boolean> {
    return this.data.map((state: QuoteState) => {
      return state.data.projects.reduce((previous: number, current: Project) => {
        return current.lineItems ? previous += current.lineItems.length : 0;
      }, 0) > 0;
    });
  }

  // Public Api
  public createQuote(): Observable<Quote> {
    return this.api.post(Api.Orders, 'quote', { loadingIndicator: true })
      .do(this.replaceQuote);
  }

  public cloneQuote(quote: Quote): Observable<Quote> {
    let clonedQuote: Quote = JSON.parse(JSON.stringify(quote));
    Common.deletePropertiesFromObject(
      clonedQuote,
      ['id', 'createdUserId', 'ownerUserId', 'createdOn', 'lastUpdated', 'expirationDate', 'quoteStatus']
    );
    return this.api.post(Api.Orders, 'quote',
      {
        loadingIndicator: true,
        body: clonedQuote
      })
      .do(this.replaceQuote);
  }

  public getFocusedQuote(): Observable<Quote> {
    return this.api.get(Api.Orders, 'quote/focused', { loadingIndicator: true }).do(this.replaceQuote);
  }

  public addProject(): void {
    this.api.post(Api.Orders, `quote/${this.quoteId}/project`, { loadingIndicator: true })
      .do(this.replaceQuote)
      .subscribe();
  }

  public removeProject(project: Project): void {
    this.api.delete(Api.Orders, `quote/${this.quoteId}/project/${project.id}`, { loadingIndicator: true })
      .subscribe(this.replaceQuote);
  }

  public addAssetToProjectInQuote(addAssetParameters: AddAssetParameters): void {
    let existingProjectNames: Array<string> = this.existingProjectNames;
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/asset/lineItem`,
      {
        body: this.formatAssetBody(addAssetParameters),
        parameters: { projectName: existingProjectNames[existingProjectNames.length - 1], region: 'AAA' }
      }
    ).subscribe(this.replaceQuote);
  }

  public updateProject(project: Project): void {
    this.api.put(Api.Orders, `quote/${this.quoteId}/project`, { body: project, loadingIndicator: true })
      .subscribe(this.replaceQuote);
  }

  public updateProjectPriceAttributes(priceAttributes: SelectedPriceAttributes, project: Project) {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/project/priceAttributes/${project.id}`,
      { body: priceAttributes, loadingIndicator: true }
    ).subscribe(this.replaceQuote);
  }

  public moveLineItemTo(project: Project, lineItem: AssetLineItem): void {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/move/lineItem`,
      { parameters: { lineItemId: lineItem.id, projectId: project.id }, loadingIndicator: true }
    ).subscribe(this.replaceQuote);
  }

  public cloneLineItem(lineItem: AssetLineItem): void {
    this.api.put(Api.Orders, `quote/${this.quoteId}/clone/lineItem`,
      { parameters: { lineItemId: lineItem.id }, loadingIndicator: true })
      .subscribe(this.replaceQuote);
  }

  public removeLineItem(lineItem: AssetLineItem): void {
    this.api.delete(Api.Orders, `quote/${this.quoteId}/asset/${lineItem.id}`, { loadingIndicator: true })
      .subscribe(this.replaceQuote);
  }

  public editLineItem(lineItem: AssetLineItem, fieldToEdit: any): void {
    if (!!fieldToEdit.pricingAttributes) {
      fieldToEdit = { attributes: this.formatAttributes(fieldToEdit.pricingAttributes) };
    }

    Object.assign(lineItem, fieldToEdit);

    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/update/lineItem/${lineItem.id}`,
      { body: lineItem, parameters: { region: 'AAA' } }
    ).subscribe(this.replaceQuote);
  }

  public editLineItemMarkers(lineItem: AssetLineItem, newMarkers: SubclipMarkersInterface.SubclipMarkers): void {
    Object.assign(lineItem.asset, {
      timeStart: SubclipMarkersInterface.timeStartFrom(newMarkers),
      timeEnd: SubclipMarkersInterface.timeEndFrom(newMarkers)
    });

    this.editLineItem(lineItem, {});
  }

  public updateQuoteField(quoteField: { [index: string]: any }) {
    let property: EditableQuoteFields = Object.keys(quoteField)[0] as EditableQuoteFields;
    if (quoteField[property] === '') {
      delete this.state.data[property];
    } else {
      Object.assign(this.state.data, quoteField);
    }

    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}`,
      { body: this.state.data, loadingIndicator: true },
    ).subscribe(this.replaceQuote);
  }

  // this does the send request and then takes user to the review page of the active quote.
  // But it does not make another focused, or create a new focused quote.
  public sendQuote(options: QuoteOptions): Observable<any> {
    return this.api.put(
      Api.Orders,
      `quote/send/${this.quoteId}`,
      { parameters: options as ApiParameters, loadingIndicator: true }
    );
  }

  public addFeeTo(project: Project, fee: FeeLineItem): void {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/fee/lineItem`,
      { body: fee, parameters: { projectName: project.name }, loadingIndicator: true }
    ).subscribe(this.replaceQuote);
  }

  public removeFee(fee: FeeLineItem): void {
    this.api.delete(
      Api.Orders,
      `quote/${this.quoteId}/fee/${fee.id}`,
      { loadingIndicator: true }
    ).subscribe(this.replaceQuote);
  }

  public get feeConfig(): Observable<FeeConfig> {
    return this.feeConfigStore.initialized ? Observable.of(this.feeConfigStore.feeConfig) : this.loadFeeConfig();
  }

  public deleteQuote(): Observable<Quote> {
    return this.api.delete(Api.Orders, `quote/${this.state.data.id}`, { loadingIndicator: 'onBeforeRequest' });
  }

  // This method is here only cause the linter gets mad if it isn't
  public retrieveLicenseAgreements(): Observable<LicenseAgreements> {
    return this.api.get(Api.Orders, 'cart/licensing');
  }

  public bulkImport(rawAssets: { lineItemAttributes: string }, projectId: string): Observable<Quote> {
    return this.api.put(Api.Orders, `quote/${this.state.data.id}/asset/direct/lineItem`, {
      body: rawAssets,
      parameters: { projectId }
    }).do(this.replaceQuote);
  }

  // Private helper methods
  private formatAssetBody(parameters: AddAssetParameters): any {
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
      timeStart = SubclipMarkersInterface.timeStartFrom(markers);
      timeEnd = SubclipMarkersInterface.timeEndFrom(markers);
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

  private get existingProjectNames(): Array<string> {
    return (this.state.data.projects || []).map((project: any) => project.name);
  }

  private replaceQuote = (quote: Quote): void => {
    this.store.replaceQuote(quote);
  }

  private loadFeeConfig(): Observable<FeeConfig> {
    return this.api.get(Api.Identities, 'feeConfig/search', { loadingIndicator: true })
      .do((response: FeeConfig) => this.feeConfigStore.replaceFeeConfigWith(response));
  }
}
