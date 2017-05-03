import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api.service';
import { Api, ApiBody, ApiParameters } from '../interfaces/api.interface';
import { Address, ViewAddress } from '../interfaces/user.interface';
import {
  Project, AssetLineItem, FeeLineItem, AddAssetParameters, Quote, QuoteState, QuoteOptions, EditableQuoteFields, FeeConfig
} from '../interfaces/commerce.interface';
import { ActiveQuoteStore } from '../stores/active-quote.store';

import { FeeConfigStore } from '../stores/fee-config.store';
import { SelectedPriceAttributes } from '../interfaces/common.interface';

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

  // Public Api

  public getFocusedQuote(): Observable<Quote> {
    return this.api.get(Api.Orders, 'quote/focused', { loading: true }).do(this.replaceQuote);
  }

  public addProject(): void {
    this.api.post(Api.Orders, `quote/${this.quoteId}/project`, { loading: true })
      .do(this.replaceQuote)
      .subscribe();
  }

  public removeProject(project: Project): void {
    this.api.delete(Api.Orders, `quote/${this.quoteId}/project/${project.id}`, { loading: true })
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
    this.api.put(Api.Orders, `quote/${this.quoteId}/project`, { body: project, loading: true })
      .subscribe(this.replaceQuote);
  }

  public updateProjectPriceAttributes(priceAttributes: SelectedPriceAttributes, project: Project) {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/project/priceAttributes/${project.id}`,
      { body: priceAttributes, loading: true }
    ).subscribe(this.replaceQuote);
  }

  public moveLineItemTo(project: Project, lineItem: AssetLineItem): void {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/move/lineItem`,
      { parameters: { lineItemId: lineItem.id, projectId: project.id }, loading: true }
    ).subscribe(this.replaceQuote);
  }

  public cloneLineItem(lineItem: AssetLineItem): void {
    this.api.put(Api.Orders, `quote/${this.quoteId}/clone/lineItem`,
      { parameters: { lineItemId: lineItem.id }, loading: true })
      .subscribe(this.replaceQuote);
  }

  public removeLineItem(lineItem: AssetLineItem): void {
    this.api.delete(Api.Orders, `quote/${this.quoteId}/asset/${lineItem.id}`, { loading: true })
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
      { body: this.state.data, loading: true },
    ).subscribe(this.replaceQuote);
  }

  public sendQuote(options: QuoteOptions): Observable<any> {
    return this.api.put(
      Api.Orders,
      `quote/send/${this.quoteId}`,
      { parameters: options as ApiParameters }
    );
  }

  public addFeeTo(project: Project, fee: FeeLineItem): void {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/fee/lineItem`,
      { body: fee, parameters: { projectName: project.name }, loading: true }
    ).subscribe(this.replaceQuote);
  }

  public removeFee(fee: FeeLineItem): void {
    this.api.delete(
      Api.Orders,
      `quote/${this.quoteId}/fee/${fee.id}`,
      { loading: true }
    ).subscribe(this.replaceQuote);
  }

  public get feeConfig(): Observable<FeeConfig> {
    return this.feeConfigStore.initialized ? Observable.of(this.feeConfigStore.feeConfig) : this.loadFeeConfig();
  }

  // Private helper methods
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

  private get existingProjectNames(): Array<string> {
    return (this.state.data.projects || []).map((project: any) => project.name);
  }

  private replaceQuote = (quote: Quote): void => {
    this.store.replaceQuote(quote);
  }

  private loadFeeConfig(): Observable<FeeConfig> {
    return this.api.get(Api.Identities, 'feeConfig/search', { loading: true })
      .do((response: FeeConfig) => this.feeConfigStore.replaceFeeConfigWith(response));
  }
}
