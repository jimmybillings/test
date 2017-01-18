import { Injectable } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Router } from '@angular/router';

@Injectable()
export class AssetCapabilities {
  constructor(public currentUser: CurrentUser, public route: Router) { }

  public viewAssetDetails(): boolean {
    return this.userHas('ViewClips');
  }

  public downloadWatermarkComps(hasComp: boolean): boolean {
    return this.userHas('DownloadWatermarkComps') && hasComp;
  }

  public downloadCleanComps(hasComp: boolean): boolean {
    return this.userHas('DownloadCleanComps') && hasComp;
  }

  public downloadFullComps(hasComp: boolean): boolean {
    return this.userHas('DownloadFullComps') && hasComp;
  }

  public viewDownloadCompOptions(hasComp: boolean): boolean {
    return this.downloadWatermarkComps(hasComp) || this.downloadCleanComps(hasComp) || this.downloadFullComps(hasComp);
  }

  public createAccessInfo(): boolean {
    return this.userHas('CreateAccessInfo');
  }

  public createSubclips(): boolean {
    // TODO: Unit test this if/when it has more functionality than just a simple boolean!
    return this.userHas('CreateSubclips');
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
