import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Asset } from '../../shared/interfaces/common.interface';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { SpeedviewData } from '../../shared/interfaces/asset.interface';

@Injectable()
export class SpeedPreviewService {
  constructor(private apiService: ApiService, private currentUserService: CurrentUserService) { }

  public load(asset: Asset): Observable<SpeedviewData> {
    let path: string = this.currentUserService.loggedIn() ?
      `assetInfo/view/SpeedView` : `assetInfo/anonymous/view/SpeedView`;

    return this.apiService.get(Api.Assets, `${path}/${asset.assetId}`);
  }

}
