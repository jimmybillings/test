import { Component, Input, OnChanges, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Address } from '../../../shared/interfaces/user.interface';

declare var google: any;

@Component({
  moduleId: module.id,
  selector: 'address-form-component',
  template: `
    <div class="wz-dialog">
      <div layout="column" layout-align="center center">
        <h1 md-dialog-title>{{ title | translate }}</h1>
      </div>
      <div layout="row" layout-align="center center">
        <form [formGroup]="addressForm" *ngIf="loaded" (ngSubmit)="saveAddress()">
          <md-input-container class="autocomplete">
            <input mdInput id="autocomplete" placeholder="Enter your full address" (focus)="geolocate()" type="text" />
          </md-input-container>
          <div class="address-form" layout="column" layout-align="center center">
            <div flex="100">
              <md-input-container>
                <input mdInput placeholder="Street Number" type="text" formControlName='street_number' />
              </md-input-container>
              <md-input-container>
                <input mdInput placeholder="Street Name" type="text" formControlName='route' />
              </md-input-container>
            </div>
            <div flex="100">
              <md-input-container>
                <input mdInput placeholder="City" type="text" formControlName='locality' />
              </md-input-container>
              <md-input-container>
                <input mdInput placeholder="State/Province" type="text" formControlName='administrative_area_level_1' />
              </md-input-container>
            </div>
            <div flex="100">
              <md-input-container>
                <input mdInput placeholder="Country" type="text" formControlName='country' />
              </md-input-container>
              <md-input-container>
                <input mdInput placeholder="Zipcode" type="text" formControlName='postal_code' />
              </md-input-container>
            </div>
            <md-input-container class="phone">
              <input mdInput placeholder="Phone Number" type="text" formControlName='phone' />
            </md-input-container>
            <button md-raised-button color="primary" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .autocomplete,.phone{width: 100%; margin-bottom: 20px};
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent implements OnChanges {
  @Input() items: any;
  @Input() loaded: boolean;
  @Input() title: string;
  @Input() address?: Address;
  @Output() onSaveAddress = new EventEmitter();
  public showForm: boolean = false;
  public addressForm: FormGroup;
  private placeSearch: any;
  private autocomplete: any;
  constructor(private fb: FormBuilder, private changeDetector: ChangeDetectorRef) { }

  ngOnChanges(changes: any) {
    this.addressForm = (changes.address && changes.address.currentValue) ?
      this.prepopulateForm(this.address) :
      this.clearForm();

    if (changes.loaded && changes.loaded.currentValue) {
      this.loadGooglePlaces();
    }
  }

  public saveAddress() {
    const formValue: any = this.addressForm.value;
    let newAddress: any = {
      address: `${formValue['street_number']} ${formValue['route']}`,
      city: formValue['locality'],
      state: formValue['administrative_area_level_1'],
      country: formValue['country'],
      zipcode: formValue['postal_code'],
      phone: formValue['phone']
    };
    this.onSaveAddress.emit(newAddress);
  }

  public geolocate(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let geolocation: any = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        let circle: any = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  private clearForm(): FormGroup {
    return this.fb.group({
      street_number: ['', Validators.required],
      route: ['', Validators.required],
      locality: ['', Validators.required],
      administrative_area_level_1: ['', Validators.required],
      country: ['', Validators.required],
      postal_code: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  private prepopulateForm(address: Address): FormGroup {
    let streetNumber: string = address.address ? address.address.match(/\d{1,}/).toString().trim() : '';
    let streetName: string = address.address ? address.address.match(/\D{1,}/).toString().trim() : '';

    return this.fb.group({
      street_number: [streetNumber, Validators.required],
      route: [streetName, Validators.required],
      locality: [address.city || '', Validators.required],
      administrative_area_level_1: [address.state || '', Validators.required],
      country: [address.country || '', Validators.required],
      postal_code: [address.zipcode || '', Validators.required],
      phone: [address.phone || '', Validators.required]
    });
  }

  private initAutocomplete = (): void => {
    this.autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')),
      { types: ['geocode'] }
    );

    this.autocomplete.addListener('place_changed', this.fillInAddress);
  }

  private fillInAddress = (): void => {
    let place: any = this.autocomplete.getPlace();

    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      if (this.addressForm.controls[addressType]) {
        let value: string = place.address_components[i]['long_name'];
        let control: AbstractControl = this.addressForm.controls[addressType];
        control.setValue(value);
      }
    }

    this.changeDetector.markForCheck();
  }

  private loadGooglePlaces(): void {
    let scriptSrc: string =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzyGsK3zaRGFAEC72nWbdRvBY1Lo92Cfw&libraries=places';
    let scripts: any = document.getElementsByTagName('script');
    let i: number = scripts.length, scriptLoaded: boolean = false;

    while (i--) {
      if (scripts[i].src === scriptSrc) {
        scriptLoaded = true;
      }
    }

    if (!scriptLoaded) {
      let script: HTMLElement = document.createElement('script');
      Object.assign(script, { src: scriptSrc, type: 'text/javascript' });
      document.body.appendChild(script);
      script.onload = this.initAutocomplete;
    }
  }
}
