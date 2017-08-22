import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { ApiService } from '../../shared/services/api.service';
import { Api, ApiOptions, ApiParameters } from '../../shared/interfaces/api.interface';
import { CurrentUserService } from '../../shared/services/current-user.service';
import * as commerce from '../interfaces/commerce.interface';
import * as common from '../interfaces/common.interface';
import { EnhancedAsset } from '../interfaces/enhanced-asset';

@Injectable()
export class AssetService {
  public errorMessage: any;

  constructor(private api: ApiService, private currentUser: CurrentUserService) { }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get(Api.Assets, `renditionType/downloadUrl/${id}`, { parameters: { type: compType } });
  }

  public createShareLink(shareLink: common.Pojo): Observable<any> {
    return this.api.post(Api.Identities, 'accessInfo', { body: shareLink });
  }

  public getClipPreviewData(assetId: number): Observable<any> {
    const viewType: ApiOptions = { parameters: { 'useType': 'clipPreview' } };
    return this.api.get(Api.Assets, `renditionType/${assetId}`, viewType);
  }
}
