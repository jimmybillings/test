import {
  Component, Input, OnChanges, OnInit, ChangeDetectionStrategy,
  Output, EventEmitter, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ViewAddress, Address } from '../../../shared/interfaces/user.interface';
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
              <div *ngFor="let row of items" layout="row" layout-align="center center">
                <div flex="100">
                  <md-input-container flex="100" *ngFor="let field of row.items" id={{field.name}}>
                    <input
                      mdInput
                      type={{field.type}}
                      formControlName={{field.name}}
                      placeholder={{field.label}}
                    />
                  </md-input-container>
                </div>
              </div>
            </div>
          <button md-raised-button [disabled]="!addressForm.valid" color="primary" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .autocomplete,#phone{width: 100%; margin-bottom: 20px}
    #addressLineOne,#addressLineTwo{width: 100%;}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() items: any;
  @Input() loaded: boolean;
  @Input() title: string;
  @Input() address: ViewAddress;
  @Output() onSaveAddress = new EventEmitter();
  public addressForm: FormGroup;
  private readonly fieldMap: any = {
    addressLineOne: ['street_number', 'route'],
    addressLineTwo: [],
    city: ['locality'],
    state: ['administrative_area_level_1'],
    zipcode: ['postal_code'],
    country: ['country'],
    phone: []
  };

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private google: GoogleService
  ) { }

  ngOnInit(): void {
    this.addressForm = this.buildForm(this.address);
  }

  ngOnChanges(changes: any) {
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
    console.log(this.addressForm.value);
    // this.onSaveAddress.emit(this.addressForm.value);
  }

  public geolocate(): void {
    if (navigator.geolocation) {
      this.google.geolocate();
    }
  }

  private fillInAddress = (): void => {
    let googleAddress: any = this.google.getPlace();

    for (let control in this.addressForm.controls) {
      let value: string = this.fieldMap[control].reduce((prev: Array<string>, field: string) => {
        let val: string = googleAddress[field] ? googleAddress[field].long_name : '';
        prev.push(val);
        return prev;
      }, []).join(' ');
      if (value !== '') this.addressForm.controls[control].setValue(value);
    }

    this.ref.detectChanges();
  }

  private buildForm(address: ViewAddress): FormGroup {
    let newForm: any = {};
    this.items.forEach((row: any) => {
      row.items.forEach((item: any) => {
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
