import { AddressFormComponent } from './address-form.component';
import { Address, ViewAddress } from '../../../shared/interfaces/user.interface';
import { FormBuilder } from '@angular/forms';

export function main() {
  describe('Address Form Component', () => {
    let componentUnderTest: AddressFormComponent, fb: FormBuilder = new FormBuilder(), mockChangeDetector: any,
      mockGoogleService: any;

    const mockAddress = {
      address: {
        addressLineOne: '123 Oak Street',
        addressLineTwo: 'Apartment 10',
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
      mockChangeDetector = { detectChanges: jasmine.createSpy('detectChanges') };
      mockGoogleService = {
        loadPlacesLibrary: jasmine.createSpy('loadPlacesLibrary'),
        autocomplete: {
          addListener: jasmine.createSpy('addListener')
        }
      };
      componentUnderTest = new AddressFormComponent(fb, mockChangeDetector, mockGoogleService);
    });

    describe('ngOnInit()', () => {
      beforeEach(() => {
        componentUnderTest.items = formItems();
      });

      it('builds the form - with blank values', () => {
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.addressForm.value).toEqual({
          addressLineOne: '',
          addressLineTwo: '',
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
        componentUnderTest.ngOnChanges({ address: { currentValue: mockAddress } });
        expect(componentUnderTest.addressForm.value).toEqual(mockAddress.address);
      });

      it('doesn\'t build the form if the address value hasn\'t changed', () => {
        expect(componentUnderTest.addressForm).toBeUndefined();
        componentUnderTest.ngOnChanges({});
        expect(componentUnderTest.addressForm).toBeUndefined();
      });

      it('calls loadPlacesLibrary() on the google service', () => {
        componentUnderTest.ngOnChanges({ loaded: { currentValue: true } });
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
      it('console.logs for now', () => {
        componentUnderTest.items = formItems();
        componentUnderTest.ngOnInit();
        spyOn(console, 'log');
        componentUnderTest.saveAddress();
        expect(console.log).toHaveBeenCalledWith(componentUnderTest.addressForm.value);
      });
    });
  });

  function formItems(): any {
    return [
      {
        items: [
          {
            name: 'addressLineOne',
            label: 'Address Line 1',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
          }
        ]
      },
      {
        items: [
          {
            name: 'addressLineTwo',
            label: 'Address Line 2',
            type: 'text',
            value: '',
            validation: 'OPTIONAL'
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
            validation: 'REQUIRED'
          },
          {
            name: 'state',
            label: 'State',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
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
            validation: 'REQUIRED'
          },
          {
            name: 'country',
            label: 'Country',
            type: 'text',
            value: '',
            validation: 'REQUIRED'
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
            validation: 'REQUIRED'
          }
        ]
      }
    ];
  }
}
