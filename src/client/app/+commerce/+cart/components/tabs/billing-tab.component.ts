import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { CurrentUserService } from '../../../../shared/services/current-user.service';
import { UserService } from '../../../../shared/services/user.service';
import { Address, User, ViewAddress } from '../../../../shared/interfaces/user.interface';
import { UiConfig } from '../../../../shared/services/ui.config';
import { CartCapabilities } from '../../services/cart.capabilities';
import { AddressFormComponent } from '../address-form.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Rx';
import { Tab } from './tab';

@Component({
  moduleId: module.id,
  selector: 'billing-tab-component',
  templateUrl: 'billing-tab.html'
})

export class BillingTabComponent extends Tab implements OnInit, OnDestroy {
  public addresses: Array<any> = [];
  public items: Array<any>;
  public selectedAddress: any;
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  private cartStoreSubscription: Subscription;

  constructor(
    public userCan: CartCapabilities,
    private cartService: CartService,
    private currentUser: CurrentUserService,
    private uiConfig: UiConfig,
    private user: UserService,
    private dialog: MdDialog) {
    super();
  }

  ngOnInit() {
    this.cartStoreSubscription = this.cartService.data
      .subscribe((data: any) => this.selectedAddress = data.orderInProgress.address);

    this.uiConfig.get('billing').take(1).subscribe((config: any) => this.items = config.config.form.items);

    this.user.getAddresses().take(1).subscribe((addresses: any[]) => {
      this.addresses = addresses;
      if (this.addresses.length !== 0) {
        this.selectAddress(this.addresses[0]);
      }
    });
  }

  ngOnDestroy() {
    this.cartStoreSubscription.unsubscribe();
  }

  public addUserAddress(address: Address, mode: 'add' | 'edit'): void {
    this.user.addBillingAddress(address).subscribe((user: User) => {
      let addr: any = { type: 'user', name: `${user.firstName} ${user.lastName}`, address: user.mailingAddress };
      this.selectAddress(addr);
      if (mode === 'add') {
        this.addresses.push(addr);
      }
    });
  }

  public addAccountAddress(address: Address): void {
    console.log('add this to the account!', address);
  }

  public selectAddress(address: ViewAddress): void {
    this.cartService.updateOrderInProgressAddress(address);
  }

  public openAddressFormFor(resourceType: 'account' | 'user', mode: 'add' | 'edit'): void {
    let dialogRef: MdDialogRef<AddressFormComponent> = this.dialog.open(AddressFormComponent, { width: '500px' });
    dialogRef.componentInstance.items = this.items;
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.componentInstance.resourceType = resourceType;
    dialogRef.componentInstance.mode = mode;
    dialogRef.componentInstance.address = mode === 'edit' ? this.selectedAddress.address : null;
    dialogRef.afterClosed().subscribe((form: any) => {
      if (typeof form === 'undefined') return;
      if (resourceType === 'user') {
        this.addUserAddress(form, mode);
      } else {
        this.addAccountAddress(form);
      }
    });
  }

  public get userCanEditAccountAddress(): boolean {
    return this.selectedAddress.type === 'account' && this.userCan.editAccountBillingAddress();
  }

  public get onlyAccountAddressesExist(): boolean {
    return this.addresses.filter((address: any) => address.type === 'user').length === 0;
  }

  public get formatSelectedAddress(): string {
    return JSON.stringify(this.selectedAddress, null, 4);
  }

  public get userCanProceed(): boolean {
    return Object.keys(this.selectedAddress.address).filter((key: string) => {
      return this.selectedAddress.address[key] !== '';
    }).length > 0;
  }

  private replaceUserAddressWith(address: any): void {
    this.addresses.map((address: any) => {
      if (address.type === 'user') {

      }
    });
  }
}
