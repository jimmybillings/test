import { Component, Output, Input, OnInit, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { UserService } from '../../../shared/services/user.service';
import { CurrentUserService } from '../../../shared/services/current-user.service';
import { Address, User, ViewAddress, AddressKeys } from '../../../shared/interfaces/user.interface';
import { CheckoutState } from '../../../shared/interfaces/commerce.interface';
import { UiConfig } from '../../../shared/services/ui.config';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { AddressFormComponent } from '../address-form/address-form.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Tab } from './tab';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';

export class CommerceBillingTab extends Tab implements OnInit {
  public orderInProgress: Observable<CheckoutState>;
  public items: Array<any>;
  public addressErrors: any = {};
  public showAddAddressForm: boolean;
  public showEditAddressForm: boolean;
  @Input() loaded: boolean;
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  constructor(
    public userCan: CommerceCapabilities,
    protected commerceService: CartService | QuoteService,
    protected uiConfig: UiConfig,
    protected user: UserService,
    protected currentUser: CurrentUserService,
    protected dialog: WzDialogService,
    protected ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.orderInProgress = this.commerceService.checkoutData;
    // this.uiConfig.get('billing').take(1).subscribe((config: any) => this.items = config.config.form.items);
    this.items = this.formItems;
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

  public selectAddress(address: ViewAddress, nextTab: boolean = true): void {
    this.commerceService.updateOrderInProgress('selectedAddress', address);
    if (nextTab) this.goToNextTab();
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

  public openFormFor(resourceType: 'account' | 'user', mode: 'edit' | 'create', address?: ViewAddress): void {
    let title: string = mode === 'edit' ? this.editFormTitle(resourceType) : this.createFormTitle(resourceType);
    this.dialog.openComponentInDialog(
      {
        componentType: AddressFormComponent,
        dialogConfig: { position: { top: '6%' } },
        inputOptions: {
          loaded: this.loaded,
          items: this.items,
          title: title,
          address: mode === 'edit' ? address : null
        },
        outputOptions: [{
          event: 'onSaveAddress',
          callback: (form: any) => {
            if (typeof form === 'undefined') return;
            if (resourceType === 'user') {
              this.addUserAddress(form);
            } else {
              this.addAccountAddress(form, address);
            }
          },
          closeOnEvent: true
        }]
      }
    );
  }

  public displayAddressErrors(addressId: number): boolean {
    return this.addressErrors[addressId] && this.addressErrors[addressId].length > 0;
  }

  public formatAddressErrors(address: ViewAddress): string {
    let errors: Array<string> = this.addressErrors[address.addressEntityId];
    return errors.reduce((prev: string, curr: string, i: number) => {
      prev += `${curr}`;
      if (i < errors.length - 1) prev += ', ';
      if (i === errors.length - 2) prev += 'and ';
      return prev;
    }, '');
  }

  public disableSelectBtnFor(address: ViewAddress): boolean {
    return !address.address ||
      (this.addressErrors[address.addressEntityId] && this.addressErrors[address.addressEntityId].length > 0);
  }

  private editFormTitle(resourceType: 'user' | 'account'): string {
    return `CART.BILLING.EDIT_${resourceType.toUpperCase()}_ADDRESS_TITLE`;
  }

  private createFormTitle(resourceType: 'user' | 'account'): string {
    return `CART.BILLING.ADD_${resourceType.toUpperCase()}_ADDRESS_TITLE`;
  }

  private fetchAddresses(): Observable<Array<ViewAddress>> {
    return this.user.getAddresses().do((addresses: Array<ViewAddress>) => {
      this.validate(addresses);
      this.showAddAddressForm = this.showAddForm(addresses);
      this.showEditAddressForm = this.showEditForm(addresses);
      this.ref.detectChanges();
      this.commerceService.updateOrderInProgress('addresses', addresses);
    });
  }

  // If GET /currentUsersAssociatedAddresses does not return ANY addresses,
  // we automatically show the add form for a new user address
  private showAddForm(addresses: Array<ViewAddress>): boolean {
    return addresses.filter((a: ViewAddress) => !!a.address).length === 0;
  }

  // if GET /currentUsersAssociatedAddresses returns only 1 address, but it is not complete,
  // we automatically show the edit form for that address
  private showEditForm(addresses: Array<ViewAddress>): boolean {
    return addresses.filter((a: ViewAddress) => !!a.address).length === 1 &&
      this.addressErrors[addresses[0].addressEntityId].length > 0;
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
    this.selectAddress(newSelected, false);
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

  private validate(addresses: Array<ViewAddress>): void {
    this.addressErrors = {};
    addresses.forEach((address: ViewAddress) => {
      this.addressErrors[address.addressEntityId] = [];
      if (!address.address) return;
      let actualAddressKeys: Array<String> = Object.keys(address.address);
      AddressKeys.forEach((key: string) => {
        if (actualAddressKeys.indexOf(key) < 0 || address.address[key] === '') {
          this.addressErrors[address.addressEntityId].push(key);
        }
      });
    });
  }

  // ------------------------------------------------------- //
  // Mock UI Config to support rows in wz-form - to be removed
  // ------------------------------------------------------- //
  private get formItems(): any {
    return [
      {
        items: [
          {
            name: 'addressLineOne',
            label: 'Address Line 1',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
          }
        ]
      },
      {
        items: [
          {
            name: 'addressLineTwo',
            label: 'Address Line 2',
            type: 'text',
            value: '',
            validation: 'OPTIONAL'
          }
        ]
      },
      {
        items: [
          {
            name: 'city',
            label: 'City',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
          },
          {
            name: 'state',
            label: 'State',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
          }
        ]
      },
      {
        items: [
          {
            name: 'zipcode',
            label: 'Zipcode/Postal Code',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
          },
          {
            name: 'country',
            label: 'Country',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
          }
        ]
      },
      {
        items: [
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
          }
        ]
      }
    ];
  }
}
