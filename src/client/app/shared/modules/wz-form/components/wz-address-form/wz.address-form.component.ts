import {
  Component, Input, ChangeDetectionStrategy,
  Output, EventEmitter, SimpleChanges, ChangeDetectorRef, Inject
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Address, FormattedGoogleAddress } from '../../../../interfaces/user.interface';
import { RowFormFields, FormRow, FormFields } from '../../../../interfaces/forms.interface';
import { GooglePlacesService } from '../../services/google-places.service';
import { Common } from '../../../../utilities/common.functions';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'wz-address-form-component',
  templateUrl: './wz.address-form.html',
  styles: [`
    .autocomplete{width: 100%; margin-bottom: 20px;}
    .submit-btn{width: 40%; margin-top: 20px;}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzAddressFormComponent {
  @Input() title: string;
  @Input()
  public set address(address: Address) {
    this.buildForm(address);
  }
  @Input()
  public set loaded(loaded: boolean) {
    if (loaded) this.loadGooglePlaces();
  }
  @Input() public includeCloseButton: boolean = false;
  @Output() onSaveAddress = new EventEmitter();
  public addressForm: FormGroup;
  public formItems: RowFormFields = this.items;

  constructor(
    private fb: FormBuilder,
    private google: GooglePlacesService,
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

  public saveAddress() {
    this.onSaveAddress.emit(this.addressForm.value);
  }

  public geolocate(): void {
    Common.setMarginTop('pac-container', this.document);
    if (navigator.geolocation) {
      this.google.geolocate();
    }
  }

  public get addressFormValid(): boolean {
    return this.addressForm.valid;
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

  private buildForm(address: Address): void {
    let newForm: any = {};

    this.forEachFormItem((item: FormFields) => {
      newForm[item.name] = this.buildFormControl(item, address);
    });

    this.addressForm = this.fb.group(newForm);
  }

  private buildFormControl(item: FormFields, address: Address): FormControl {
    let validator = item.validation === 'REQUIRED' ? Validators.required : null;
    let value: string = address && address ? address[item.name] : '';
    return new FormControl(value, validator);
  }

  private forEachFormItem(processor: (item: FormFields) => void): void {
    this.formItems.forEach((row: FormRow) => row.fields.forEach(processor));
  }

  private loadGooglePlaces(): void {
    this.google.loadPlacesLibrary(this.fillInAddress);
  }

  // ------------------------------------------------------- //
  // UI Config to support rows in wz-form - to be removed
  // ------------------------------------------------------- //
  private get items(): RowFormFields {
    return [
      {
        fields: [
          {
            name: 'address',
            label: 'Address Line 1',
            type: 'text',
            value: '',
            validation: 'REQUIRED',
            googleFields: ['street_number', 'route'],
            addressType: 'long_name'
          }
        ]
      },
      {
        fields: [
          {
            name: 'address2',
            label: 'Address Line 2',
            type: 'text',
            value: '',
            validation: 'OPTIONAL',
            googleFields: [],
            addressType: ''
          }
        ]
      },
      {
        fields: [
          {
            name: 'city',
            label: 'City',
            type: 'text',
            value: '',
            validation: 'REQUIRED',
            googleFields: ['locality'],
            addressType: 'long_name'
          },
          {
            name: 'state',
            label: 'State',
            type: 'text',
            value: '',
            validation: 'REQUIRED',
            googleFields: ['administrative_area_level_1'],
            addressType: 'short_name'
          }
        ]
      },
      {
        fields: [
          {
            name: 'zipcode',
            label: 'Zipcode/Postal Code',
            type: 'text',
            value: '',
            validation: 'REQUIRED',
            googleFields: ['postal_code'],
            addressType: 'short_name'
          },
          {
            name: 'country',
            label: 'Country',
            type: 'text',
            value: '',
            validation: 'REQUIRED',
            googleFields: ['country'],
            addressType: 'long_name'
          }
        ]
      },
      {
        fields: [
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'text',
            value: '',
            validation: 'REQUIRED',
            googleFields: [],
            addressType: ''
          }
        ]
      }
    ];
  }
}
