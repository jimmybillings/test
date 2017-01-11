import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../services/api.service';
import { Api, ApiBody } from '../interfaces/api.interface';
import { CurrentUser } from '../services/current-user.model';

import { Project, LineItem } from '../interfaces/cart.interface';
import { CartStore } from '../stores/cart.store';
import { CartUtilities } from '../utilities/cart.utilities';

@Injectable()
export class CartService {
  constructor(
    private store: CartStore,
    private api: ApiService,
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
    return this.api.get(Api.Orders, 'cart', { loading: true })
      .do(this.updateCart)
      .flatMap(_ => this.addProjectIfNoProjectsExist())
      .takeLast(1)
      .map(_ => { return {}; })
      .share();
  }

  public getCartSummary(): void {
    this.api.get(Api.Orders, 'cart/summary').subscribe(this.updateCart);
  }

  public addProject(): void {
    this.addProjectAndReturnObservable().subscribe();
  }

  public removeProject(project: Project): void {
    this.api.delete(Api.Orders, `cart/project/${project.id}`, { loading: true })
      .subscribe(wholeCartResponse => {
        this.updateCart(wholeCartResponse);
        this.addProjectIfNoProjectsExist().subscribe();
      });
  }

  public addAssetToProjectInCart(assetId: string, transcodeTarget?: string): void {
    let existingProjectNames: Array<string> = this.existingProjectNames;
    this.api.put(
      Api.Orders,
      'cart/asset/lineItem/quick',
      {
        body: this.formatAsset(assetId, transcodeTarget),
        parameters: { projectName: existingProjectNames[existingProjectNames.length - 1], region: 'AAA' }
      }
    ).subscribe(this.updateCart);
  }

  public updateProject(project: Project): void {
    this.api.put(Api.Orders, 'cart/project', { body: project, loading: true })
      .subscribe(this.updateCart);
  }

  public moveLineItemTo(project: Project, lineItem: LineItem): void {
    this.api.put(Api.Orders, 'cart/move/lineItem', { parameters: { lineItemId: lineItem.id, projectId: project.id }, loading: true })
      .subscribe(this.updateCart);
  }

  public cloneLineItem(lineItem: LineItem): void {
    this.api.put(Api.Orders, 'cart/clone/lineItem', { parameters: { lineItemId: lineItem.id }, loading: true })
      .subscribe(this.updateCart);
  }

  public removeLineItem(lineItem: LineItem): void {
    this.api.delete(Api.Orders, `cart/asset/${lineItem.id}`, { loading: true })
      .subscribe(this.updateCart);
  }

  public purchaseOnCredit(): Observable<any> {
    return this.api.post(Api.Orders, 'cart/checkout/purchaseOnCredit', { loading: true }).do(() => {
      this.initializeData().subscribe();
    });
  }

  public editLineItem(lineItem: LineItem, fieldToEdit: any): void {
    Object.assign(lineItem, fieldToEdit);
    this.api.put(Api.Orders, `cart/update/lineItem/${lineItem.id}`, { body: lineItem }).take(1)
      .subscribe(this.updateCart);
  }

  private formatAsset(assetId: string, transcodeTarget: string = 'master_copy'): any {
    return {
      lineItem: {
        asset: {
          assetId: assetId
        },
        selectedTranscodeTarget: transcodeTarget
      }
    };
  }

  private addProjectIfNoProjectsExist(): Observable<any> {
    return ((this.state.projects || []).length === 0) ? this.addProjectAndReturnObservable() : Observable.of({});
  }

  private addProjectAndReturnObservable(): Observable<any> {
    return this.api.post(Api.Orders, 'cart/project', { body: this.createAddProjectRequestBody(), loading: true })
      .do(this.updateCart)
      .share();
  }

  private createAddProjectRequestBody(): ApiBody {
    return {
      name: CartUtilities.nextNewProjectNameGiven(this.existingProjectNames),
      clientName: this.fullName
    };
  }

  private get fullName(): string {
    let userName: string;
    this.currentUser.fullName().take(1).subscribe(fullName => userName = fullName);
    return userName;
  }

  private get existingProjectNames(): Array<string> {
    return (this.state.projects || []).map((project: any) => project.name);
  }

  // This is an "instance arrow function", which saves us from having to "bind(this)"
  // every time we use this function as a callback.
  private updateCart = (wholeCartResponse: any): void => {
    this.store.replaceWith(wholeCartResponse);
  }
}
