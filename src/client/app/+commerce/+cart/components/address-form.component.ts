import { Component, Input, OnInit } from '@angular/core';
import { Address } from '../../../shared/interfaces/user.interface';

@Component({
  moduleId: module.id,
  selector: 'address-form-component',
  template: `<div flex-gt-lg="100" flex-gt-md="100" flex-gt-sm="100" flex="100">
    <md-card class="wz-form-card md-elevation-z20">
      <button md-dialog-close md-icon-button title="close dialog" type="button" class="close"><md-icon>close</md-icon></button>
      <md-card-title>
         {{ 'CART.BILLING.MODIFY_ADDRESS' | translate:{mode: capitalize(mode), resource: capitalize(resourceType)} }}
      </md-card-title>
      <md-card-content>
        <wz-form [items]="items" submitLabel="{{ 'CART.BILLING.SAVE_ADDRESS_BTN_LABEL' | translate }}"
          (formSubmit)="dialog.close($event)"></wz-form>
      </md-card-content>
    </md-card>
  </div>`
})
export class AddressFormComponent implements OnInit {
  @Input() dialog: any;
  @Input() items: any[];
  @Input() address: Address;
  @Input() resourceType: 'user' | 'account';
  @Input() mode: 'add' | 'edit';

  ngOnInit() {
    if (this.address) {
      this.items.map((item: any) => {
        item.value = this.address[item.name];
      });
    }
  }

  public capitalize(s: string): string {
    return s.charAt(0).toUpperCase().concat(s.slice(1));
  }
}
