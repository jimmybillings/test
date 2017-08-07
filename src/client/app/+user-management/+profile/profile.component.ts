import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UserService } from '../../shared/services/user.service';
import { User, Address, UserBasicInfo } from '../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs/Subscription';
import { WzComingSoonComponent } from '../../shared/components/wz-coming-soon/wz-coming-soon.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzAddressFormComponent } from '../../shared/modules/wz-form/components/wz-address-form/wz.address-form.component';
import { UiConfig } from '../../shared/services/ui.config';
import { FormFields } from '../../shared/interfaces/forms.interface';

@Component({
  moduleId: module.id,
  selector: 'profile-component',
  templateUrl: 'profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnDestroy, OnInit {
  public user: User;
  public accountName: string;
  private userSubscription: Subscription;

  constructor(
    private currentUser: CurrentUserService,
    private dialogService: WzDialogService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private uiConfig: UiConfig
  ) { }

  ngOnInit() {
    this.userSubscription = this.currentUser.data.subscribe((user: User) => {
      this.user = user;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public onClickEditBasicInfoButton() {
    this.uiConfig.get('userBasicInfo').take(1).subscribe((config: any) => {
      let prefilledFields: Array<FormFields> = [];
      config.config.form.items.forEach((formField: FormFields) =>
        prefilledFields.push(Object.assign({}, formField, { value: this.user[formField.name] })));
      this.dialogService.openFormDialog(prefilledFields, {
        title: 'PROFILE.BASIC_INFO.EDIT_BTN_LABEL', submitLabel: 'PROFILE.BASIC_INFO.UPDATE_BTN_LABEL'
      }, this.changeBasicInfo);
    });
  }

  public onClickEditAddressButton() {
    this.dialogService.openComponentInDialog({
      componentType: WzAddressFormComponent,
      dialogConfig: { disableClose: true },
      inputOptions: {
        address: this.user.billingInfo.address,
        loaded: true,
        title: 'PROFILE.BASIC_INFO.BILLING_ADDRESS_EDIT_BTN_LABEL'
      },
      outputOptions: [{
        event: 'onSaveAddress',
        callback: this.addBillingAddress,
        closeOnEvent: true
      }]
    });
  }

  public userAccountName(id: number): string {
    this.userService.getAccount(this.user.accountId).take(1).subscribe((account: any) =>
      this.accountName = account.name);
    return this.accountName;
  }

  public getBillingAddressInfo(segment: string): string {
    return this.user.billingInfo && this.user.billingInfo.address ? this.user.billingInfo.address[segment] : '';
  }

  private addBillingAddress = (form: Address) => {
    this.userService.addBillingAddress(form).subscribe();
  }

  private changeBasicInfo = (form: UserBasicInfo) => {
    this.userService.changeBasicInfo(form).subscribe();
  }
}
