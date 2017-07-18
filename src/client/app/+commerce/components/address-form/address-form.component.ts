import {
  Component, Input, OnChanges, OnInit, ChangeDetectionStrategy,
  Output, EventEmitter, ChangeDetectorRef, AfterViewInit, ViewChild,
  ElementRef
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
            <input #search mdInput id="autocomplete" placeholder="Enter your full address" (focus)="geolocate()" type="text" />
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
  private autocomplete: any;
  private readonly scriptSrc: string =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzyGsK3zaRGFAEC72nWbdRvBY1Lo92Cfw&libraries=places';
  private readonly fieldMap: any = {
    addressLineOne: ['street_number', 'route', 'neighborhood'],
    addressLineTwo: [],
    city: ['locality'],
    state: ['administrative_area_level_1'],
    zipcode: ['postal_code'],
    country: ['country'],
    phone: []
  };
  @ViewChild('search') private searchElement: ElementRef;

  constructor(private fb: FormBuilder, private ref: ChangeDetectorRef) { }

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
      this.items.forEach((row: any) => {
        row.items.forEach((item: any) => {
          let validator = item.validation === 'REQUIRED' ? Validators.required : null;
          newForm[item.name] = new FormControl({ value: address.address[item.name], disabled: false }, validator);
        });
      });
    } else {
      this.items.forEach((row: any) => {
        row.items.forEach((item: any) => {
          let validator = item.validation === 'REQUIRED' ? Validators.required : null;
          newForm[item.name] = new FormControl({ value: '', disabled: false }, validator);
        });
      });
    }
    return this.fb.group(newForm);
  }

  private initAutocomplete = (): void => {
    if ((<any>window).google) {
      this.autocomplete = new (<any>window).google.maps.places.Autocomplete(
        this.searchElement.nativeElement,
        { types: ['geocode'] }
      );

      this.autocomplete.addListener('place_changed', this.fillInAddress);
    }
  }

  private fillInAddress = (): void => {
    let place: any = this.autocomplete.getPlace();

    let googleAddress: any = place.address_components.reduce((prev: any, current: any) => {
      prev[current.types[0]] = { long_name: current['long_name'], short_name: current['long_name'] };
      return prev;
    }, {});

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

// <div class="address-form" layout="column" layout-align="center center">
// <md-input-container class="stretch">
//   <input
//     mdInput
//     placeholder="Address Line 1"
//     type="text"
//     formControlName='street_number'
//     autocomplete='address-line1'
//   />
// </md-input-container>
// <md-input-container class="stretch">
//   <input
//     mdInput
//     placeholder="Address Line 2"
//     type="text"
//     formControlName='apt'
//     autocomplete='address-line2'
//   />
// </md-input-container>
// <div flex="100">
//   <md-input-container>
//     <input mdInput placeholder="City" type="text" formControlName='locality' name='city' />
//   </md-input-container>
//   <md-input-container>
//     <input mdInput placeholder="State/Province" type="text" formControlName='administrative_area_level_1' />
//   </md-input-container>
// </div>
// <div flex="100">
//   <md-input-container>
//     <input mdInput placeholder="Country" type="text" formControlName='country' autocomplete='country'/>
//   </md-input-container>
//   <md-input-container>
//     <input mdInput placeholder="Zip/Postal Code" type="text" formControlName='postal_code'
//       autocomplete='postal-code'
//     />
//   </md-input-container>
// </div>
// <md-input-container class="phone">
//   <input mdInput placeholder="Phone Number" type="text" formControlName='phone' autocomplete='tel' />
// </md-input-container>
// <button md-raised-button [disabled]="!addressForm.valid" color="primary" type="submit">Submit</button>
// </div>
