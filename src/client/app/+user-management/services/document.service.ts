import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable } from 'Rxjs/rx';

@Injectable()
export class DocumentService {
  private portal: string;

  constructor(private api: ApiService, private apiConfig: ApiConfig) {
    this.portal = this.apiConfig.getPortal();
  }

  public downloadActiveDocument(): Observable<any> {
    return this.api.get(Api.Identities, 'document/6/activeVersion/downloadFile').do((data: any) => {
      console.log(data);
    })
  }
}