import { AddressFormComponent } from './address-form.component';
import { FormBuilder } from '@angular/forms';

export function main() {
  describe('Address Form Component', () => {
    let componentUnderTest: AddressFormComponent, fb: FormBuilder = new FormBuilder(), mockGoogleService: any;

    const mockAddress = {
      address: {
        address: '123 Oak Street',
        address2: 'Apartment 10',
        state: 'CO',
        country: 'USA',
        zipcode: '11111',
        phone: '2223334444',
        city: 'Denver'
      },
      addressEntityId: 123,
      defaultAddress: false,
      type: 'User',
      name: 'Ross Edfort'
    };

    beforeEach(() => {
      mockGoogleService = {
        loadPlacesLibrary: jasmine.createSpy('loadPlacesLibrary'),
        autocomplete: {
          addListener: jasmine.createSpy('addListener')
        }
      };
      componentUnderTest = new AddressFormComponent(fb, mockGoogleService);
    });

    describe('ngOnInit()', () => {
      beforeEach(() => {
        componentUnderTest.items = formItems();
      });

      it('builds the form - with blank values', () => {
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.addressForm.value).toEqual({
          address: '',
          address2: '',
          state: '',
          country: '',
          zipcode: '',
          phone: '',
          city: ''
        });
      });

      it('builds the form - with prepopulated values', () => {
        componentUnderTest.address = mockAddress as any;
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.addressForm.value).toEqual(mockAddress.address);
      });
    });

    describe('ngOnChanges()', () => {
      beforeEach(() => {
        componentUnderTest.items = formItems();
      });

      it('builds the form if the address value is truthy', () => {
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.ngOnChanges({ address: { currentValue: mockAddress } } as any);
        expect(componentUnderTest.addressForm.value).toEqual(mockAddress.address);
      });

      it('doesn\'t build the form if the address value hasn\'t changed', () => {
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.ngOnChanges({});
        expect(componentUnderTest.addressForm).toBeUndefined();
      });

      it('calls loadPlacesLibrary() on the google service', () => {
        componentUnderTest.ngOnChanges({ loaded: { currentValue: true } } as any);
        expect(mockGoogleService.loadPlacesLibrary).toHaveBeenCalled();
      });
    });

    describe('ngAfterViewInit()', () => {
      beforeEach(() => {
        componentUnderTest.items = formItems();
      });

      it('should build the addressForm if it doesn\'t exist', () => {
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.ngAfterViewInit();
        expect(componentUnderTest.addressForm).toBeDefined();
      });
    });

    describe('saveAddress()', () => {
      it('emits the onSaveAddress event with the form value', () => {
        componentUnderTest.items = formItems();
        componentUnderTest.ngOnInit();
        spyOn(componentUnderTest.onSaveAddress, 'emit');
        componentUnderTest.saveAddress();
        expect(componentUnderTest.onSaveAddress.emit).toHaveBeenCalledWith(componentUnderTest.addressForm.value);
      });
    });
  });

  function formItems(): any {
    return [
      {
        items: [
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
        items: [
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
        items: [
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
        items: [
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
        items: [
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
