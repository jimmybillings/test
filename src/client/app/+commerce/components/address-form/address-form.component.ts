import {
  Component, Input, OnChanges, OnInit, ChangeDetectionStrategy,
  Output, EventEmitter, AfterViewInit, SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ViewAddress, Address, FormattedGoogleAddress } from '../../../shared/interfaces/user.interface';
import { RowFormFields, FormRow, FormFields } from '../../../shared/interfaces/forms.interface';
import { GoogleService } from '../../services/google.service';

@Component({
  moduleId: module.id,
  selector: 'address-form-component',
  template: `
    <div class="wz-dialog">
      <div layout="column" layout-align="center center">
        <h1 md-dialog-title>{{ title | translate }}</h1>
      </div>
      <div layout="column" layout-align="center center">
        <form [formGroup]="addressForm" *ngIf="loaded" (ngSubmit)="saveAddress()">
          <md-input-container class="autocomplete">
            <input mdInput id="autocomplete" placeholder="Enter your full address" (focus)="geolocate()" type="text" />
          </md-input-container>
          <div class="address-form" layout="column" layout-align="center center">
            <div flex="100">
              <div *ngFor="let row of formItems" layout="row" layout-align="center center">
                <md-input-container flex="100" *ngFor="let field of row.fields" id={{field.name}}>
                  <input
                    mdInput
                    type={{field.type}}
                    formControlName={{field.name}}
                    placeholder={{field.label}}
                  />
                </md-input-container>
              </div>
            </div>
            <button
              class="submit-btn"
              md-raised-button
              [disabled]="!addressForm.valid"
              color="primary"
              type="submit">
                Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .autocomplete{width: 100%; margin-bottom: 20px;}
    .submit-btn{width: 40%; margin-top: 20px;}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() formItems: RowFormFields;
  @Input() loaded: boolean;
  @Input() title: string;
  @Input() address: ViewAddress;
  @Output() onSaveAddress = new EventEmitter();
  public addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private google: GoogleService
  ) { }

  ngOnInit(): void {
    this.addressForm = this.buildForm(this.address);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.address && changes.address.currentValue) {
      this.addressForm = this.buildForm(changes.address.currentValue);
    }

    if (changes.loaded && changes.loaded.currentValue) {
      this.loadGooglePlaces();
    }
  }

  ngAfterViewInit(): void {
    if (!this.addressForm) this.addressForm = this.buildForm(this.address);
    if (this.loaded) this.loadGooglePlaces();
  }

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

    this.formItems.forEach((row: FormRow) => {
      row.fields.forEach((item: FormFields) => {
        let value: string = item.googleFields.reduce((prev: Array<string>, field: string) => {
          prev.push(googleAddress[field][item.addressType] || '');
          return prev;
        }, []).join(' ');
        if (value.length) this.addressForm.controls[item.name].setValue(value);
      });
    });
  }

  private buildForm(address: ViewAddress): FormGroup {
    let newForm: any = {};
    this.formItems.forEach((row: FormRow) => {
      row.fields.forEach((item: FormFields) => {
        let validator = item.validation === 'REQUIRED' ? Validators.required : null;
        let value: string = address && address.address ? address.address[item.name] : '';
        newForm[item.name] = new FormControl(value, validator);
      });
    });
    return this.fb.group(newForm);
  }

  private loadGooglePlaces(): void {
    this.google.loadPlacesLibrary(this.fillInAddress);
  }
}
