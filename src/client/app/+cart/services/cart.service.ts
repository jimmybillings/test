import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../../shared/services/api.service';
import { CartSummaryService } from '../../shared/services/cart-summary.service';

import { Project } from '../cart.interface';
import { CartStore } from './cart.store';
import { CartUtilities } from './cart.utilities';

@Injectable()
export class CartService {
  constructor(
    private store: CartStore,
    private apiService: ApiService,
    private cartSummaryService: CartSummaryService
  ) { }

  public get data(): Observable<any> {
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
    return this.apiServiceGet('orders', 'cart', { loading: true })
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
    this.apiServiceDelete('orders', `cart/project/${project.id}`, { loading: true })
      .subscribe(wholeCartResponse => {
        this.store.replaceWith(wholeCartResponse);
        this.cartSummaryService.loadCartSummary();
      });
  }

  private addProjectIfNoProjectsExist(): Observable<any> {
    return ((this.state.projects || []).length === 0) ? this.addProjectAndReturnObservable() : Observable.of({});
  }

  private addProjectAndReturnObservable(): Observable<any> {
    return this.apiServicePost('orders', 'cart/project', this.createAddProjectRequestBody(), { loading: true })
      .do(wholeCartResponse => this.store.replaceWith(wholeCartResponse))
      .do(_ => this.cartSummaryService.loadCartSummary())
      .share();
  }

  private createAddProjectRequestBody(): string {
    let existingNames: Array<string> =
      (this.state.projects || []).map((project: any) => project.name);

    return JSON.stringify({
      name: CartUtilities.nextNewProjectNameGiven(existingNames)
    });
  }

  // Idea for ApiService enhancement.
  // If/when the ApiService abstracts away URL construction and JSON responses for us,
  // these methods will no longer be needed.
  private get defaultApiServiceOptions(): ApiServiceOptions {
    return { requestOptions: {}, loading: false };
  }

  private apiServiceGet(apiService: string, urlEnding: string, options: ApiServiceOptions = {}): Observable<any> {
    options = Object.assign({}, this.defaultApiServiceOptions, options);
    return this.apiService.get(`/api/${apiService}/v1/${urlEnding}`, options.requestOptions, options.loading)
      .map(response => response.json());
  }

  private apiServicePost(apiService: string, urlEnding: string, body: string, options: ApiServiceOptions = {}): Observable<any> {
    options = Object.assign({}, this.defaultApiServiceOptions, options);
    return this.apiService.post(`/api/${apiService}/v1/${urlEnding}`, body, options.requestOptions, options.loading)
      .map(response => response.json());
  }

  private apiServiceDelete(apiService: string, urlEnding: string, options: ApiServiceOptions = {}): Observable<any> {
    options = Object.assign({}, this.defaultApiServiceOptions, options);
    return this.apiService.delete(`/api/${apiService}/v1/${urlEnding}`, options.requestOptions, options.loading)
      .map(response => response.json());
  }
  // END of ApiService abstractions.
}

// Extra definitions for ApiService abstraction/demo.
import { RequestOptionsArgs } from '@angular/http';

interface ApiServiceOptions {
  requestOptions?: RequestOptionsArgs;
  loading?: boolean;
}
// END of ApiService abstractions.
