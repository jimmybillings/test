import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Address } from '../../../shared/interfaces/user.interface';

@Component({
  moduleId: module.id,
  selector: 'address-form-component',
  template: `
    <div class="wz-dialog">
      <div layout="row" layout-align="center center">
        <h1 md-dialog-title>
          {{ title | translate }}
        </h1>
      </div>
      <md-dialog-content>
        <wz-form
          [items]="items"
          [submitLabel]="'CART.BILLING.SAVE_ADDRESS_BTN_LABEL' | translate"
          (formSubmit)="saveAddress($event)">
        </wz-form>
      </md-dialog-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent implements OnInit {
  @Input() title: string;
  @Input() items: any[];
  @Input() address: Address;
  @Output() onSaveAddress = new EventEmitter();

  ngOnInit() {
    if (this.address) {
      this.prepopulateForm(this.address);
    } else {
      this.clearForm();
    }
  }

  public saveAddress(form: any) {
    this.onSaveAddress.emit(form);
  }

  private clearForm(): void {
    this.items.map((item: any) => item.value = '');
  }

  private prepopulateForm(address: Address): void {
    this.items.map((item: any) => item.value = address[item.name]);
  }
}
