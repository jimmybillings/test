import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
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
  templateUrl: 'billing-tab.html'
})

export class BillingTabComponent extends Tab implements OnInit, OnDestroy {
  public addresses: Array<any> = [];
  public items: Array<any>;
  public selectedAddress: ViewAddress;
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  private cartStoreSubscription: Subscription;

  constructor(
    public userCan: CartCapabilities,
    private cartService: CartService,
    private uiConfig: UiConfig,
    private user: UserService,
    private dialog: MdDialog) {
    super();
  }

  ngOnInit() {
    this.cartStoreSubscription = this.cartService.data
      .subscribe((data: any) => this.selectedAddress = data.orderInProgress.address);

    this.uiConfig.get('billing').take(1).subscribe((config: any) => this.items = config.config.form.items);

    this.fetchAddresses().subscribe(this.determineNewSelectedAddress);
  }

  ngOnDestroy() {
    this.cartStoreSubscription.unsubscribe();
  }

  public addUserAddress(form: Address): void {
    this.user.addBillingAddress(form).subscribe((user: User) => {
      this.fetchAddresses().subscribe(this.determineNewSelectedAddress);
    });
  }

  public addAccountAddress(form: Address, wholeAddress: ViewAddress): void {
    let newAddress: ViewAddress = Object.assign({}, wholeAddress, { address: form });
    this.user.addAccountBillingAddress(newAddress).subscribe((account: any) => {
      this.fetchAddresses().subscribe(this.determineNewSelectedAddress);
    });
  }

  public selectAddress(address: ViewAddress): void {
    this.cartService.updateOrderInProgressAddress(address);
  }

  public get userCanProceed(): boolean {
    return Object.keys(this.selectedAddress.address).filter((key: string) => {
      return this.selectedAddress.address[key] === '';
    }).length === 0;
  }


  public get addressesAreEmpty(): boolean {
    return this.addresses.filter((a: ViewAddress) => !!a.address).length === 0;
  }

  public format(address: ViewAddress): string {
    if (address.address) {
      return Object.keys(address.address).reduce((previous: string, current: string) => {
        if (current === 'address' || current === 'zipcode' || current === 'phone') {
          previous += `${address.address[current]}<br>`;
        } else {
          previous += `${address.address[current]}, `;
        }
        return previous;
      }, '');
    } else {
      return `There is no address on record for this ${address.type}`;
    }
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

  private fetchAddresses(): Observable<any> {
    return this.user.getAddresses().do((addresses: any) => {
      this.addresses = addresses.list;
    });
  }

  private determineNewSelectedAddress = (addresses: { list: Array<ViewAddress> }) => {
    let newSelected: ViewAddress;
    if (this.selectedAddress && typeof this.selectedAddress.addressEntityId !== 'undefined') {
      newSelected = this.previouslySelectedAddress();
    } else {
      newSelected = addresses.list[0];
    }
    if (!!newSelected.address) {
      this.selectAddress(newSelected);
    }
  }

  private previouslySelectedAddress(): ViewAddress {
    return this.addresses.filter((a: ViewAddress) => {
      return a.addressEntityId === this.selectedAddress.addressEntityId;
    })[0];
  }
}
