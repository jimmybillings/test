import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

@Injectable()
export class TranslateService {
  constructor(private api: ApiService) { }

  public getTrStrings(site: string, lang: string): Observable<any> {
    return this.api.get2(Api.Identities, `translation/${site}/${lang}.json`);
  }

  public put(text: any, siteName: string, language: string): Observable<any> {
    return this.api.get2(
      Api.Identities,
      'translation/searchFields',
      { parameters: { fields: 'siteName,language', values: `${siteName},${language}` } }
    ).map(response => {
      const id: number = response['items'][0].id;
      const name: string = `${siteName}_${language}`;
      const newText: any = { id, siteName, language, name, text };

      return this.api.put2(Api.Identities, `translation/${id}`, { body: newText });
    });
  }
}
