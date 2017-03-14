import { Component, Input, OnInit } from '@angular/core';
import { Address } from '../../../shared/interfaces/user.interface';

@Component({
  moduleId: module.id,
  selector: 'address-form-component',
  template: `<div class="wz-dialog">
    <button md-icon-button md-dialog-close title="Close" type="button" class="close">
      <md-icon>close</md-icon>
    </button>
    <h1 md-dialog-title>
      {{ 'CART.BILLING.MODIFY_ADDRESS' | translate:{mode: capitalize(mode), resource: capitalize(resourceType)} }}
    </h1>
    <md-dialog-content>
      <wz-form [items]="items" submitLabel="{{ 'CART.BILLING.SAVE_ADDRESS_BTN_LABEL' | translate }}"
      (formSubmit)="dialog.close($event)"></wz-form>
    </md-dialog-content>
  </div>`
})
export class AddressFormComponent implements OnInit {
  @Input() dialog: any;
  @Input() items: any[];
  @Input() resourceType: 'user' | 'account';
  @Input() mode: 'create' | 'edit';
  @Input() address: Address;

  ngOnInit() {
    if (this.address) {
      this.prepopulateForm(this.address);
    } else {
      this.clearForm();
    }
  }

  public capitalize(s: string): string {
    return s.charAt(0).toUpperCase().concat(s.slice(1));
  }

  private clearForm(): void {
    this.items.map((item: any) => item.value = '');
  }

  private prepopulateForm(address: Address): void {
    this.items.map((item: any) => item.value = address[item.name]);
  }
}
