import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Api, ApiResponse } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';

@Injectable()
export class DocumentService {
  public activeVersionId: string;
  constructor(private api: ApiService) { }

  public downloadActiveTosDocument(): Observable<any> {
    return this.api.get(Api.Identities, 'document/public/name/TOS').flatMap((response: ApiResponse) => {
      this.activeVersionId = response[0].activeVersionId;
      return this.api.get(Api.Identities, `document/public/downloadFile/${response[0].activeVersionId}`, { download: true });
    }).map((response: Response) => {
      console.log(response);
      return response.text();
    });
  }

  public agreeUserToTerms(): void {
    this.api.post(Api.Identities, `document/version/${this.activeVersionId}/agree`).take(1).subscribe();
  }
}