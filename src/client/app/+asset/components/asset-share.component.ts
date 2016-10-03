import { Component, Input, Output, ViewChild, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AssetService } from '../services/asset.service';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { WzToastComponent } from '../../shared/components/wz-toast/wz.toast.component';
import { CurrentUser } from '../../shared/services/current-user.model';
import { User} from '../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'asset-share',
  templateUrl: 'asset-share.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetShareComponent implements OnDestroy {
  @Input() currentUser: CurrentUser;
  @Input() uiState: any;
  @Input() config: any;
  @Input() assetThumbnailUrl: any;
  @Input() assetName: any;
  @Input() assetId: any;
  @Output() close = new EventEmitter();

  public assetLinkIsShowing: boolean = false;
  public assetShareLink: any = '';
  public serverErrors: any;
  public formItems: Array<any> = [];
  public user: User;
  private userSubscription: Subscription;


  @ViewChild(WzFormComponent) private wzForm: WzFormComponent;
  @ViewChild(WzToastComponent) private wzToast: WzToastComponent;

  constructor(
    currentUser: CurrentUser,
    private asset: AssetService,
    private changeDetector: ChangeDetectorRef) {
      this.userSubscription = currentUser.profile.subscribe((user: User) => this.user = user);
  }

  public ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public closeAssetShare(): void {
    this.close.emit();
  }

  public showShareLink(assetId: any) {
    // we need to pass ISO formatted time stamps for the start and end time.
    let shareLink: any = {};
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);
    shareLink.accessEndDate = this.IsoFormatLocalDate(endDate);
    shareLink.accessStartDate = this.IsoFormatLocalDate(new Date());
    shareLink.accessInfo = assetId;
    shareLink.type = 'asset';

    this.asset.createShareLink(shareLink).take(1).subscribe((res) => {
      this.assetShareLink = `${window.location.href};share_key=${res.apiKey}`;
      this.changeDetector.markForCheck();
    });
    this.assetLinkIsShowing = !this.assetLinkIsShowing;
  }

  public createShareLink(shareLink: any, assetId: any): void {
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);
    shareLink.accessEndDate = this.IsoFormatLocalDate(endDate);
    shareLink.accessStartDate = this.IsoFormatLocalDate(new Date());
    shareLink.accessInfo = assetId;
    shareLink.type = 'asset';
    shareLink.recipientEmails = (shareLink.recipientEmails) ? shareLink.recipientEmails.split(/\s*,\s*/) : [];
    if (shareLink.copyMe) {
      shareLink.recipientEmails.push(this.user.emailAddress);
    }
    this.asset.createShareLink(shareLink).take(1).subscribe((res) => {
      this.success();
      this.wzToast.show();
    }, this.error.bind(this));
  }

  private success(): void {
    this.formItems = this.clearForm();
    this.wzForm.resetForm();
    this.changeDetector.markForCheck();
    this.closeAssetShare();
  }

  private clearForm() {
    return this.formItems
      .map((field: FormFields) => {
        field.value = '';
        if (field.type === 'tags') field.tags = [];
        return field;
      });
  }

  private error(error: any) {
    this.serverErrors = error.json();
    this.changeDetector.markForCheck();
    // this.uiState.loading(false);
  }

  // we need to submit date/timestamps in ISO format. This does that.
  private IsoFormatLocalDate(date: any) {
    var d = date,
      tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num: any) {
        var norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear()
      + '-' + pad(d.getMonth() + 1)
      + '-' + pad(d.getDate())
      + 'T' + pad(d.getHours())
      + ':' + pad(d.getMinutes())
      + ':' + pad(d.getSeconds())
      + dif + pad(tzo / 60)
      + ':' + pad(tzo % 60);
  }
}
