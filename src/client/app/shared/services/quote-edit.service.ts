import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api.service';
import { Api, ApiBody } from '../interfaces/api.interface';
import { Address, ViewAddress } from '../interfaces/user.interface';
import { Project, AssetLineItem, AddAssetParameters, Quote, QuoteState, QuoteOptions } from '../interfaces/commerce.interface';
import { ActiveQuoteStore } from '../stores/active-quote.store';

@Injectable()
export class QuoteEditService {
  constructor(
    private store: ActiveQuoteStore,
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

  public get hasAssets(): Observable<boolean> {
    return this.quote.map(quote => (quote.itemCount || 0) > 0);
  }

  public get quoteId(): number {
    return this.state.data.id;
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

  public moveLineItemTo(project: Project, lineItem: AssetLineItem): void {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}/move/lineItem`,
      { parameters: { lineItemId: lineItem.id, projectId: project.id }, loading: true }
    ).subscribe(this.replaceQuote);
  }

  public cloneLineItem(lineItem: AssetLineItem): void {
    this.api.put(Api.Orders, `quote/${this.quoteId}/clone/lineItem`, { parameters: { lineItemId: lineItem.id }, loading: true })
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

  public updateQuoteField(quoteField: any) {
    this.api.put(
      Api.Orders,
      `quote/${this.quoteId}`,
      { body: Object.assign(this.state.data, quoteField) }
    ).subscribe(this.replaceQuote);
  }
  // This will eventually change to a /sendQuote endpoint via CRUX-1846
  public sendQuote(options: QuoteOptions): Observable<any> {
    return this.api.put(
      Api.Orders,
      `quote/${this.quoteId}`,
      { body: this.formatQuoteBody(this.state.data, options) }
    );
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

  private formatQuoteBody(quote: Quote, options: QuoteOptions): any {
    // We don't want to send 'standard' to the API, as it's not a valid option.
    // we leave it blank so the end user can decide later to pay with credit-card or purchase on credit
    if (options.purchaseType === 'standard') options.purchaseType = null;

    // find the id of the user that this quote is for
    let ownerUserId: number = options.users ? options.users.filter((user: any) => {
      return user.emailAddress === options.emailAddress;
    })[0].id : null;

    // shove the extra quote params on to the current quote
    let body: any = Object.assign(
      quote,
      {
        purchaseType: options.purchaseType,
        expirationDate: new Date(options.expirationDate).toISOString(),
        quoteStatus: 'ACTIVE'
      }
    );

    // add the user id if it exists
    if (ownerUserId) Object.assign(body, { ownerUserId });

    return body;
  }

  private replaceQuote = (quote: Quote): void => {
    this.store.replaceQuote(quote);
  }
}
