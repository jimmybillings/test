import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiConfig } from '../../shared/services/api.config';
import { Api, ApiOptions, ApiParameters, ApiBody, ApiErrorResponse } from '../../shared/interfaces/api.interface';
import { UiState } from '../../shared/services/ui.state';
import { ApiService } from '../../shared/services/api.service';
import { AppStore } from '../../app.store';

@Injectable()
export class FutureApiService extends ApiService {
  constructor(protected http: Http, protected apiConfig: ApiConfig, protected uiState: UiState, protected store: AppStore) {
    super(http, apiConfig, uiState, store);
  }

  protected call(method: RequestMethod, api: Api, endpoint: string, options: ApiOptions): Observable<any> {
    options = this.combineDefaultOptionsWith(options);

    this.showLoadingIf(options.loadingIndicator === 'onBeforeRequest' || options.loadingIndicator === true);

    const request: Request = new Request(
      new RequestOptions(
        { method: method, url: this.urlFor(api, endpoint), body: this.bodyJsonFrom(options.body) }
      ).merge(this.requestOptionsArgsFrom(options))
    );

    return this.http.request(request)
      .map(response => { try { return response.json(); } catch (exception) { return response; } })
      .do(() => {
        this.hideLoadingIf(options.loadingIndicator === 'offAfterResponse' || options.loadingIndicator === true);
      }, (error: ApiErrorResponse) => {
        this.hideLoadingIf(options.loadingIndicator === 'offAfterResponse' || options.loadingIndicator === true);
        // Just let the error pass through.  We'll do this JSON-ing or dispatching elsewhere.
        // try { return error.json(); } catch (exception) { this.error.dispatch(error); }
        // return error;
      });
  }
}
