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
  ) {}

  public get data(): Observable<any> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  public initializeData(): Observable<any> {
    return this.apiServiceGet('orders', 'cart', { loading: true })
      .do(wholeCartResponse => this.store.replaceWith(wholeCartResponse))
      .map(() => { return {}; })
      .share();
  }

  public addProject(): void {
    this.apiServicePost('orders', 'cart/project', this.createAddProjectRequestBody(), { loading: true })
      .subscribe(wholeCartResponse => {
        this.store.replaceWith(wholeCartResponse);
        this.cartSummaryService.loadCartSummary();
      });
  }

  public removeProject(project: Project): void {
    this.apiServiceDelete('orders', `cart/project/${project.id}`, { loading: true })
      .subscribe(wholeCartResponse => {
        this.store.replaceWith(wholeCartResponse);
        this.cartSummaryService.loadCartSummary();
      });
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

import { RequestOptionsArgs } from '@angular/http';

interface ApiServiceOptions {
  requestOptions?: RequestOptionsArgs;
  loading?: boolean;
}
