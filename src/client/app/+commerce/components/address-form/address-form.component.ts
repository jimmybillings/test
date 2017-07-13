import {
  Component, Input, OnChanges, OnInit, ChangeDetectionStrategy,
  Output, EventEmitter, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ViewAddress, Address } from '../../../shared/interfaces/user.interface';

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
            <div layout="row" layout-align="space-between center">
              <md-input-container flex="30">
                <input mdInput placeholder="Street Number" type="text" formControlName='street_number' />
              </md-input-container>
              <md-input-container flex="70">
                <input mdInput placeholder="Street Name" type="text" formControlName='route' />
              </md-input-container>
            </div>
            <div class="apt">
              <md-input-container class="apt">
                <input mdInput placeholder="Apartment/Suite" type="text" formControlName='apt' />
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
                <input mdInput placeholder="Zip/Postal Code" type="text" formControlName='postal_code' />
              </md-input-container>
            </div>
            <md-input-container class="phone">
              <input mdInput placeholder="Phone Number" type="text" formControlName='phone' />
            </md-input-container>
            <button md-raised-button [disabled]="!addressForm.valid" color="primary" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .autocomplete,.phone{width: 100%; margin-bottom: 20px}
    .apt{width: 100%;}
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
  private autocomplete: any;
  private readonly scriptSrc: string =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzyGsK3zaRGFAEC72nWbdRvBY1Lo92Cfw&libraries=places';
  constructor(private fb: FormBuilder, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.addressForm = this.buildForm(this.address);
  }

  ngOnChanges(changes: any) {
    if (changes.address && changes.address.currentValue) {
      console.log(changes.address);
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
    const formValue: any = this.addressForm.value;
    let newAddress: any = {
      address: `${formValue['street_number']} ${formValue['route']} ${formValue['apt']}`,
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
        let circle: any = new (<any>window).google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  private buildForm(address: ViewAddress): FormGroup {
    let newForm: any = {};
    if (address) {
      newForm = this.prepopulateForm(address.address);
    } else {
      this.items.forEach((item: any) => {
        newForm[item.name] = new FormControl({ value: '', disabled: false }, Validators.required);
      });
    }
    return this.fb.group(newForm);
  }

  private prepopulateForm(address: Address): any {
    let streetNumber: string = address.address ? address.address.match(/\d{1,}/).join('').trim() : '';
    let streetName: string = address.address ? address.address.match(/\D\w{1,}/g).join('').trim() : '';
    console.log(streetNumber, streetName);
    return {
      street_number: [streetNumber, Validators.required],
      route: [streetName, Validators.required],
      apt: [''],
      locality: [address.city || '', Validators.required],
      administrative_area_level_1: [address.state || '', Validators.required],
      country: [address.country || '', Validators.required],
      postal_code: [address.zipcode || '', Validators.required],
      phone: [address.phone || '', Validators.required]
    };
  }

  private initAutocomplete = (): void => {
    if ((<any>window).google) {
      this.autocomplete = new (<any>window).google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')),
        { types: ['geocode'] }
      );

      this.autocomplete.addListener('place_changed', this.fillInAddress);
    }
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

    this.ref.detectChanges();
  }

  private loadGooglePlaces(): void {
    let scripts: any = document.getElementsByTagName('script');
    let i: number = scripts.length, scriptLoaded: boolean = false;

    while (i--) {
      if (scripts[i].src === this.scriptSrc) {
        scriptLoaded = true;
      }
    }

    if (scriptLoaded) {
      this.initAutocomplete();
    } else {
      let script: HTMLElement = document.createElement('script');
      Object.assign(script, { src: this.scriptSrc, type: 'text/javascript' });
      document.body.appendChild(script);
      script.onload = this.initAutocomplete;
    }
  }
}
