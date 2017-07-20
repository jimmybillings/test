import { AddressFormComponent } from './address-form.component';
import { FormBuilder } from '@angular/forms';
import { ViewAddress } from '../../../shared/interfaces/user.interface';

export function main() {
  describe('Address Form Component', () => {
    let componentUnderTest: AddressFormComponent, fb: FormBuilder = new FormBuilder(), mockGoogleService: any;

    const mockAddress: ViewAddress = {
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
      componentUnderTest = new AddressFormComponent(fb, mockGoogleService, null);
    });

    describe('address setter', () => {
      beforeEach(() => {
        componentUnderTest.formItems = formItems();
      });

      it('builds the addressForm', () => {
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.address = mockAddress;
        expect(componentUnderTest.addressForm.value).toEqual(mockAddress.address);
      });
    });

    describe('loaded setter', () => {
      it('calls loadPlacesLibrary() on the google service', () => {
        componentUnderTest.loaded = true;
        expect(mockGoogleService.loadPlacesLibrary).toHaveBeenCalled();
      });
    });

    describe('saveAddress()', () => {
      it('emits the onSaveAddress event with the form value', () => {
        componentUnderTest.formItems = formItems();
        componentUnderTest.address = mockAddress;

        spyOn(componentUnderTest.onSaveAddress, 'emit');
        componentUnderTest.saveAddress();
        expect(componentUnderTest.onSaveAddress.emit).toHaveBeenCalledWith(componentUnderTest.addressForm.value);
      });
    });
  });

  function formItems(): any {
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
