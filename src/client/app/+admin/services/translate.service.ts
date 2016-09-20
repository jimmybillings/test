import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TranslateService {
  public trUrl: string;
  public siteApiUrl: string;

  constructor(public http: Http, public apiConfig: ApiConfig) {
    this.trUrl = this.apiConfig.baseUrl() + 'api/identities/v1/translation/';
  }

  public getTrStrings(site: string, lang: string): Observable<any> {
    return this.http.get(this.trUrl + site + '/' + lang + '.json',
      { headers: this.apiConfig.authHeaders(), body: '' }
    ).map((res: Response) => res.json());
  }

  public put(text: any, siteName: string, language: string): Observable<any> {
    let name: string = `${siteName}_${language}`;
    let options = this.buildSearchOptions({fields: 'siteName,language', values: `${siteName},${language}`});
    return this.http.get(this.trUrl + 'searchFields?', options).map(res => {
      let id: number = res.json().items[0].id;
      let newText: any = { id, siteName, language, name, text };
      return this.http.put(this.trUrl + id, JSON.stringify(newText), { headers: this.apiConfig.authHeaders() });
    });
  }

  public buildSearchOptions(queryObject: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    let options = this.buildRequestOptions(search);
    return new RequestOptions(options);
  }

    public buildRequestOptions(search?: URLSearchParams): RequestOptions {
    let headers = this.apiConfig.authHeaders();
    return search ? new RequestOptions({ headers, search, body: '' }) : new RequestOptions({ headers, body: '' });
  }
}
