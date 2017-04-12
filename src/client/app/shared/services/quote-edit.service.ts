import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api.service';
import { Api, ApiBody } from '../interfaces/api.interface';
import { Address, ViewAddress } from '../interfaces/user.interface';
import { Project, LineItem, AddAssetParameters } from '../interfaces/cart.interface';
import { ActiveQuoteStore } from '../stores/active-quote.store';
import { Quote, QuoteState } from '../interfaces/quote.interface';
import { QuoteOptions } from '../../shared/interfaces/quote.interface';

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

  // Public Api

  public getFocusedQuote(): Observable<Quote> {
    return this.api.get(Api.Orders, 'quote/focused', { loading: true }).do(this.replaceQuoteWith);
  }

  public getQuoteSummary(): void {
    this.api.get(Api.Orders, 'quote/summary')
      .subscribe((quoteSummary: any) => this.updateQuoteWith(quoteSummary));
  }

  public addProject(): void {
    this.api.post(Api.Orders, 'quote/project', { loading: true })
      .do(this.replaceQuoteWith)
      .subscribe();
  }

  public removeProject(project: Project): void {
    console.warn('this needs to be fixed!');
    // this.api.delete(Api.Orders, `quote/project/${project.id}`, { loading: true })
    //   .subscribe(this.replaceQuoteWith);
  }

  public addAssetToProjectInQuote(addAssetParameters: AddAssetParameters): void {
    let existingProjectNames: Array<string> = this.existingProjectNames;
    this.api.put(
      Api.Orders,
      'quote/asset/lineItem/quick',
      {
        body: this.formatAssetBody(addAssetParameters),
        parameters: { projectName: existingProjectNames[existingProjectNames.length - 1], region: 'AAA' }
      }
    ).subscribe(this.replaceQuoteWith);
  }

  public updateProject(project: Project): void {
    this.api.put(Api.Orders, 'quote/project', { body: project, loading: true })
      .subscribe(this.replaceQuoteWith);
  }

  public moveLineItemTo(project: Project, lineItem: LineItem): void {
    this.api.put(
      Api.Orders,
      'quote/move/lineItem',
      { parameters: { lineItemId: lineItem.id, projectId: project.id }, loading: true }
    ).subscribe(this.replaceQuoteWith);
  }

  public cloneLineItem(lineItem: LineItem): void {
    this.api.put(Api.Orders, 'quote/clone/lineItem', { parameters: { lineItemId: lineItem.id }, loading: true })
      .subscribe(this.replaceQuoteWith);
  }

  public removeLineItem(lineItem: LineItem): void {
    console.warn('this needs to be fixed!');
    // this.api.delete(Api.Orders, `quote/asset/${lineItem.id}`, { loading: true })
    //   .subscribe(this.replaceQuoteWith);
  }

  public editLineItem(lineItem: LineItem, fieldToEdit: any): void {
    if (!!fieldToEdit.pricingAttributes) {
      fieldToEdit = { attributes: this.formatAttributes(fieldToEdit.pricingAttributes) };
    }
    Object.assign(lineItem, fieldToEdit);
    this.api.put(Api.Orders, `quote/update/lineItem/${lineItem.id}`, { body: lineItem, parameters: { region: 'AAA' } })
      .subscribe(this.replaceQuoteWith);
  }

  public sendQuote(options: QuoteOptions): Observable<any> {
    console.warn('this needs to be fixed!');
    return Observable.of({});
    // return this.store.data.flatMap((state: QuoteState) => {
    //   let body: any = this.formatQuoteBody(state.data, options);
    //   return this.api.post(Api.Orders, 'quote', { body: body });
    // });
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

  private formatQuoteBody(cart: any, options: QuoteOptions): any {
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
      { purchaseType: options.purchaseType, expirationDate: options.expirationDate }
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
  private replaceQuoteWith = (quote: Quote): void => {
    this.store.replaceQuoteWith(quote);
  }

  private updateQuoteWith = (quoteSummary: any): void => {
    this.store.updateQuoteWith(quoteSummary);
  }

}
