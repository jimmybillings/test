import { Component, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { UserService } from '../../../shared/services/user.service';
import { CurrentUserService } from '../../../shared/services/current-user.service';
import { Address, User, ViewAddress } from '../../../shared/interfaces/user.interface';
import { UiConfig } from '../../../shared/services/ui.config';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { AddressFormComponent } from '../address-form/address-form.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Tab } from './tab';

export class CommerceBillingTab extends Tab implements OnInit {
  public orderInProgress: Observable<any>;
  public items: Array<any>;
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  constructor(
    public userCan: CommerceCapabilities,
    protected commerceService: CartService | QuoteService,
    protected uiConfig: UiConfig,
    protected user: UserService,
    protected currentUser: CurrentUserService,
    protected dialog: MdDialog) {
    super();
  }

  ngOnInit() {
    this.orderInProgress = this.commerceService.data.map((data: any) => data.orderInProgress);
    this.uiConfig.get('billing').take(1).subscribe((config: any) => this.items = config.config.form.items);
    this.fetchAddresses().subscribe();
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
    this.commerceService.updateOrderInProgress('selectedAddress', address);
    if (address.type === 'account') {
      this.user.getAccount(address.addressEntityId).subscribe((account: any) => {
        this.commerceService.updateOrderInProgress('purchaseOptions', {
          purchaseOnCredit: account.purchaseOnCredit ? true : false,
          creditExemption: account.creditExemption
        });
      });
    } else {
      this.commerceService.updateOrderInProgress('purchaseOptions', {
        purchaseOnCredit: this.currentUser.state.purchaseOnCredit
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
    let dialogRef: MdDialogRef<AddressFormComponent> = this.dialog.open(AddressFormComponent, { position: { top: '6%' } });
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

  private fetchAddresses(): Observable<Array<ViewAddress>> {
    return this.user.getAddresses().do((addresses: Array<ViewAddress>) => {
      this.commerceService.updateOrderInProgress('addresses', addresses);
    });
  }

  private determineNewSelectedAddress = (addresses: Array<ViewAddress>) => {
    let newSelected: ViewAddress;
    this.orderInProgress.take(1).subscribe((data: any) => {
      if (data.selectedAddress && typeof data.selectedAddress.addressEntityId !== 'undefined') {
        newSelected = this.previouslySelectedAddress;
      } else {
        newSelected = data.addresses.filter((a: ViewAddress) => !!a.address)[0];
      }
    });
    this.selectAddress(newSelected);
  }

  private get previouslySelectedAddress(): ViewAddress {
    let previouslySelected: ViewAddress;
    this.orderInProgress.take(1).subscribe((data: any) => {
      previouslySelected = data.addresses.filter((a: ViewAddress) => {
        return a.addressEntityId === data.selectedAddress.addressEntityId;
      })[0];
    });
    return previouslySelected;
  }
}
