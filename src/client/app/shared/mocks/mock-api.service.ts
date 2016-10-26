import { Observable } from 'rxjs/Rx';

import { ApiService } from '../services/api.service';
import { ApiResponse } from '../interfaces/api.interface';

// Add these to a beforeEach() method with addMatchers(mockApiMatchers).
export { mockApiMatchers } from './mock-api.matchers';

export class MockApiService {
  // Responses:
  // Set these if you care about the contents of a specific response
  // (so you can verify that some other code uses some part of that response).
  // 
  // Otherwise, you can just use them as-is to verify that the appropriate
  // response was passed along to some other code.
  //
  // Note also that the initial values for these responses are worthless,
  // but there is *something* in there so that the likelihood of accidentally
  // matching these responses in real specs is almost zero.
  public getResponse: ApiResponse = { responseFor: 'get' };
  public postResponse: ApiResponse = { responseFor: 'post' };
  public putResponse: ApiResponse = { responseFor: 'put' };
  public deleteResponse: ApiResponse = { responseFor: 'delete' };

  // Errors:
  // These are normally dormant, but if you set them to something, then the
  // spy's returned Observable will throw your specified error value (instead of
  // emitting the normal response) when the spy is called.
  public getError: any;
  public postError: any;
  public putError: any;
  public deleteError: any;

  private spies: MockApiServiceSpies;
  private apiService: ApiService;

  constructor() {
    this.initialize();
  }

  // Inject this into the service you are testing.
  public get injector(): ApiService {
    return this.apiService;
  }

  // Spies:
  // Use these in your jasmine expectations.
  public get get(): jasmine.Spy { return this.spies.get; }
  public get post(): jasmine.Spy { return this.spies.post; }
  public get put(): jasmine.Spy { return this.spies.put; }
  public get delete(): jasmine.Spy { return this.spies.delete; }

  private initialize() {
    this.apiService = new ApiService(null, null, null, null, null);

    this.spies = {
      get: spyOn(this.apiService, 'get').and.callFake(() => {
        return this.getError ? Observable.throw(this.getError) : Observable.of(this.getResponse);
      }),

      post: spyOn(this.apiService, 'post').and.callFake(() => {
        return this.postError ? Observable.throw(this.postError) : Observable.of(this.postResponse);
      }),

      put: spyOn(this.apiService, 'put').and.callFake(() => {
        return this.putError ? Observable.throw(this.putError) : Observable.of(this.putResponse);
      }),

      delete: spyOn(this.apiService, 'delete').and.callFake(() => {
        return this.deleteError ? Observable.throw(this.deleteError) : Observable.of(this.deleteResponse);
      })
    };
  }
}

interface MockApiServiceSpies { get: jasmine.Spy; post: jasmine.Spy; put: jasmine.Spy; delete: jasmine.Spy; };
