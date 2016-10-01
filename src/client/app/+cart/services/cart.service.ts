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
    return this.apiServiceGet('orders', 'cart')
      .do(wholeCartResponse => this.store.replaceWith(wholeCartResponse))
      .map(() => { return {}; })
      .share();
  }

  public addProject(): void {
    this.apiServicePost('orders', 'cart/project', this.createAddProjectRequestBody())
      .subscribe(wholeCartResponse => {
        this.store.replaceWith(wholeCartResponse);
        this.cartSummaryService.loadCartSummary();
      });
  }

  public removeProject(project: Project): void {
    this.apiServiceDelete('orders', `cart/project/${project.id}`)
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
  private apiServiceGet(apiService: string, urlEnding: string): Observable<any> {
    return this.apiService.get(`/api/${apiService}/v1/${urlEnding}`, {}, true)
      .map(response => response.json());
  }

  private apiServicePost(apiService: string, urlEnding: string, body: string): Observable<any> {
    return this.apiService.post(`/api/${apiService}/v1/${urlEnding}`, body, {}, true)
      .map(response => response.json());
  }

  private apiServiceDelete(apiService: string, urlEnding: string): Observable<any> {
    return this.apiService.delete(`/api/${apiService}/v1/${urlEnding}`)
      .map(response => response.json());
  }
  // END of ApiService abstractions.
}
