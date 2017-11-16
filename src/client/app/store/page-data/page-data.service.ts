import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Pojo } from '../../shared/interfaces/common.interface';

@Injectable()
export class PageDataService {
  constructor(private translateService: TranslateService, private titleService: Title) { }

  public updateTitle(trKey: string, trParams?: Pojo): void {
    this.translateService.get(trKey).subscribe(value => this.titleService.setTitle(value));
  }
}
