import {
  Component, Input, ChangeDetectionStrategy,
  Output, EventEmitter, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ViewAddress, Address, FormattedGoogleAddress } from '../../../shared/interfaces/user.interface';
import { RowFormFields, FormRow, FormFields } from '../../../shared/interfaces/forms.interface';
import { GooglePlacesService } from '../../services/google-places.service';

@Component({
  moduleId: module.id,
  selector: 'address-form-component',
  templateUrl: './address-form.html',
  styles: [`
    .autocomplete{width: 100%; margin-bottom: 20px;}
    .submit-btn{width: 40%; margin-top: 20px;}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent {
  @Input() formItems: RowFormFields;
  @Input() title: string;
  @Input()
  public set address(address: ViewAddress) {
    this.buildForm(address);
  }
  @Input()
  public set loaded(loaded: boolean) {
    if (loaded) this.loadGooglePlaces();
  }
  @Output() onSaveAddress = new EventEmitter();
  public addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private google: GooglePlacesService,
    private ref: ChangeDetectorRef
  ) { }

  public saveAddress() {
    this.onSaveAddress.emit(this.addressForm.value);
  }

  public geolocate(): void {
    if (navigator.geolocation) {
      this.google.geolocate();
    }
  }

  private fillInAddress = (): void => {
    let googleAddress: FormattedGoogleAddress = this.google.getPlace();

    this.forEachFormItem((item: FormFields) => {
      this.setControlValue(item, googleAddress);
    });

    this.ref.detectChanges();
  }

  private setControlValue(item: FormFields, googleAddress: FormattedGoogleAddress): void {
    let value: string = item.googleFields.reduce((prev: Array<string>, field: string) => {
      prev.push(googleAddress[field] ? googleAddress[field][item.addressType] : '');
      return prev;
    }, []).join(' ').trim();
    if (value.length) this.addressForm.controls[item.name].setValue(value);
  }

  private buildForm(address: ViewAddress): void {
    let newForm: any = {};

    this.forEachFormItem((item: FormFields) => {
      newForm[item.name] = this.buildFormControl(item, address);
    });

    this.addressForm = this.fb.group(newForm);
  }

  private buildFormControl(item: FormFields, address: ViewAddress): FormControl {
    let validator = item.validation === 'REQUIRED' ? Validators.required : null;
    let value: string = address && address.address ? address.address[item.name] : '';
    return new FormControl(value, validator);
  }

  private forEachFormItem(processor: (item: FormFields) => void): void {
    this.formItems.forEach((row: FormRow) => row.fields.forEach(processor));
  }

  private loadGooglePlaces(): void {
    this.google.loadPlacesLibrary(this.fillInAddress);
  }
}
