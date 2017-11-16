import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Pojo } from '../../shared/interfaces/common.interface';

@Injectable()
export class PageDataService {
  constructor(private translateService: TranslateService, private titleService: Title) { }

  public updateTitle(trKey: string, trParams?: Pojo): void {
    Observable.forkJoin([
      this.translateService.get('COMPANY_NAME'),
      this.translateService.get(trKey, trParams)
    ]).take(1).subscribe((values: string[]) => {
      this.titleService.setTitle(values.join(''));
    });
  }
}
