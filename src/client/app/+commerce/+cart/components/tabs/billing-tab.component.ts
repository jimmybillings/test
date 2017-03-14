import { Component, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { UserService } from '../../../../shared/services/user.service';
import { Address, User, ViewAddress } from '../../../../shared/interfaces/user.interface';
import { UiConfig } from '../../../../shared/services/ui.config';
import { CartCapabilities } from '../../services/cart.capabilities';
import { AddressFormComponent } from '../address-form.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Subscription, Observable } from 'rxjs/Rx';
import { Tab } from './tab';

@Component({
  moduleId: module.id,
  selector: 'billing-tab-component',
  templateUrl: 'billing-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BillingTabComponent extends Tab implements OnInit {
  public orderInProgress: Observable<any>;
  public items: Array<any>;
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  private currentAccount: any;

  constructor(
    public userCan: CartCapabilities,
    private cartService: CartService,
    private uiConfig: UiConfig,
    private user: UserService,
    private dialog: MdDialog) {
    super();
  }

  ngOnInit() {
    this.orderInProgress = this.cartService.data.map((data: any) => data.orderInProgress);

    this.uiConfig.get('billing').take(1).subscribe((config: any) => this.items = config.config.form.items);

    this.fetchAddresses().subscribe(this.cartService.determineNewSelectedAddress);
  }

  public addUserAddress(form: Address): void {
    this.user.addBillingAddress(form).subscribe((user: User) => {
      this.fetchAddresses().subscribe(this.cartService.determineNewSelectedAddress);
    });
  }

  public addAccountAddress(form: Address, wholeAddress: ViewAddress): void {
    let newAddress: ViewAddress = Object.assign({}, wholeAddress, { address: form });
    this.user.addAccountBillingAddress(newAddress).subscribe((account: any) => {
      this.fetchAddresses().subscribe(this.cartService.determineNewSelectedAddress);
    });
  }

  public selectAddress(address: ViewAddress): void {
    this.cartService.updateSelectedAddress(address);
    if (address.type === 'account' && !this.currentAccount) {
      this.fetchAccount(address.addressEntityId).subscribe((account: any) => {
        this.currentAccount = account;
      });
    }
  }

  public get userCanProceed(): Observable<boolean> {
    return this.orderInProgress.map((data: any) => {
      if (!data.selectedAddress.address) {
        return false;
      } else {
        return Object.keys(data.selectedAddress.address).filter((k: string) => {
          return data.selectedAddress.address[k] === '';
        }).length === 0;
      }
    });
  }

  public get addressesAreEmpty(): Observable<boolean> {
    return this.orderInProgress.map((data: any) => {
      return data.addresses.filter((a: ViewAddress) => !!a.address).length === 0;
    });
  }

  public openFormFor(resourceType: 'account' | 'user', mode: 'edit' | 'create', address?: ViewAddress): void {
    let dialogRef: MdDialogRef<AddressFormComponent> = this.dialog.open(AddressFormComponent, { position: { top: '10%' } });
    dialogRef.componentInstance.items = this.items;
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.componentInstance.resourceType = resourceType;
    dialogRef.componentInstance.mode = mode;
    if (mode === 'edit') dialogRef.componentInstance.address = address.address;
    dialogRef.afterClosed().subscribe((form: any) => {
      if (typeof form === 'undefined') return;
      if (resourceType === 'user') {
        this.addUserAddress(form);
      } else {
        this.addAccountAddress(form, address);
      }
    });
  }

  private fetchAccount(accountId: number): Observable<any> {
    return this.user.getAccount(accountId);
  }

  private fetchAddresses(): Observable<Array<ViewAddress>> {
    return this.user.getAddresses().do((addresses: Array<ViewAddress>) => {
      this.cartService.setAddresses(addresses);
    });
  }
}
