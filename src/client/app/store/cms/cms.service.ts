import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { createClient, Entry } from 'contentful';
import { Pojo } from '../../shared/interfaces/common.interface';

const CONFIG = {
  space: '9f7tranrpc7k',
  accessToken: 'b4975cae9e5642e38f23ce25f2d3a11486bdc627d6c96cd1a4134e69e6988e91',
};

@Injectable()
export class CmsService {
  private cdaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken
  });

  constructor(private apiService: FutureApiService) { }

  public loadFooter(query?: object): Observable<Pojo> {
    return Observable.fromPromise(this.cdaClient.getEntries(
      { content_type: 'footer', include: 10 })
      .then(res => this.normalizeFooter(res.toPlainObject().items[0].fields)));
  }

  public loadHomeAssets() {
    return Observable.fromPromise(this.cdaClient.getEntries(
      { content_type: 'homePage', include: 10 })
      .then(res => this.normalizeHomeAssets(res.toPlainObject().items[0].fields)))
  }

  private normalizeFooter(footer: Pojo): Pojo {
    return {
      columns: footer.column.map((column: Pojo) => {
        return column.fields.footerLineItem.map((data: Pojo) => {
          return { type: data.sys.contentType.sys.id, ...data.fields };
        });
      })
    };
  }

  private normalizeHomeAssets(homeAssets: Pojo): Pojo {
    return {
      hero: {
        url: homeAssets.hero.fields.file.url,
        height: homeAssets.hero.fields.file.details.image.height,
        width: homeAssets.hero.fields.file.details.image.width
      },
      highlights: homeAssets.highlights.map((highlight: any) => {
        return {
          label: highlight.fields.label,
          url: highlight.fields.media.fields.file.url,
          link: highlight.fields.url
        }
      })
    };
  }
}
