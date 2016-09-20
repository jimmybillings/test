import { Injectable } from '@angular/core';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';

@Injectable()
export class TranslateService {
  public trUrl: string;
  public siteApiUrl: string;

  constructor(public api: ApiService, public apiConfig: ApiConfig) {
    this.trUrl = this.apiConfig.baseUrl() + 'identities-api/v1/translation/';
  }

  public getTrStrings(site: string, lang: string): Observable<any> {
    return this.api.get(this.trUrl + site + '/' + lang + '.json')
      .map((res: Response) => res.json());
  }

  public put(text: any, siteName: string, language: string): Observable<any> {
    let name: string = `${siteName}_${language}`;
    let options = this.buildSearchOptions({fields: 'siteName,language', values: `${siteName},${language}`});
    return this.api.get(this.trUrl + 'searchFields?', options).map(res => {
      let id: number = res.json().items[0].id;
      let newText: any = { id, siteName, language, name, text };
      return this.api.put(this.trUrl + id, JSON.stringify(newText));
    });
  }

  public buildSearchOptions(queryObject: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    return search ? new RequestOptions({ search }) : new RequestOptions({});
  }
}
