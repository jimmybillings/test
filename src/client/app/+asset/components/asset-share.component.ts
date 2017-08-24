import {
  Component, Input, Output, ViewChild,
  EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { AssetService } from '../../store/services/asset.service';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { WzFormComponent } from '../../shared/modules/wz-form/wz.form.component';
import { User } from '../../shared/interfaces/user.interface';
import { Pojo } from '../../shared/interfaces/common.interface';
import { Subscription } from 'rxjs/Subscription';
import { EnhancedAsset } from '../../shared/interfaces/enhanced-asset';

@Component({
  moduleId: module.id,
  selector: 'asset-share',
  templateUrl: 'asset-share.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetShareComponent {
  @Input() userEmail: string;
  @Input() config: any;
  @Input() enhancedAsset: EnhancedAsset;
  @Output() close = new EventEmitter();
  @Output() onOpenSnackBar = new EventEmitter();

  public assetLinkIsShowing: boolean = false;
  public assetShareLink: string;
  public serverErrors: any;
  public formItems: Array<any> = [];
  public user: User;

  @ViewChild(WzFormComponent) private wzForm: WzFormComponent;

  constructor(
    private asset: AssetService,
    private changeDetector: ChangeDetectorRef) {
  }

  public closeAssetShare(): void {
    this.close.emit();
  }

  public showShareLink(): void {
    this.asset.createShareLink(this.prepareShareLink())
      .subscribe((res) => {
        this.assetShareLink = `${window.location.href};share_key=${res.apiKey}`;
        this.changeDetector.markForCheck();
      });
    this.assetLinkIsShowing = true;
  }

  public resetShareLinkShowing() {
    this.assetLinkIsShowing = false;
  }

  public createShareLink(shareLink: Pojo): void {
    this.asset.createShareLink(this.prepareShareLink(shareLink))
      .subscribe((res) => {
        this.resetForm();
        this.onOpenSnackBar.emit({ key: 'ASSET.SHARING.SHARED_CONFIRMED_MESSAGE' });
      }, this.error.bind(this));
  }

  public formCancel() { this.resetForm(); }

  private prepareShareLink(shareLink: Pojo = {}): Pojo {
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    Object.assign(shareLink, {
      accessEndDate: this.IsoFormatLocalDate(endDate),
      accessStartDate: this.IsoFormatLocalDate(new Date()),
      accessInfo: this.enhancedAsset.getMetadataValueFor('lsdkjf'),
      type: 'asset',
      recipientEmails: (shareLink.recipientEmails) ?
        shareLink.recipientEmails.split(/\s*,\s*|\s*;\s*/) : [],
      timeStart: this.enhancedAsset.timeStart,
      timeEnd: this.enhancedAsset.timeEnd,
    });

    if (shareLink.copyMe) {
      shareLink.recipientEmails.push(this.userEmail);
    }

    return shareLink;
  }

  private resetForm(): void {
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

  private error(error: Pojo) {
    this.serverErrors = error.json();
    this.changeDetector.markForCheck();
  }

  // we need to submit date/timestamps in ISO format. This does that.
  private IsoFormatLocalDate(date: Date) {
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
