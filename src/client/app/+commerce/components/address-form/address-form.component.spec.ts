import { AddressFormComponent } from './address-form.component';
import { Address } from '../../../shared/interfaces/user.interface';

export function main() {
  describe('Address Form Component', () => {
    let componentUnderTest: AddressFormComponent, mockAddress: Address, items: any;

    mockAddress = {
      address: '123 Oak Street',
      state: 'CO',
      country: 'USA',
      zipcode: '11111',
      phone: '2223334444',
      city: 'Denver'
    };

    items = [
      { name: 'address', value: '' },
      { name: 'state', value: '' },
      { name: 'country', value: '' },
      { name: 'zipcode', value: '' },
      { name: 'phone', value: '' },
      { name: 'city', value: '' }
    ];

    beforeEach(() => {
      componentUnderTest = new AddressFormComponent();
    });

    describe('ngOnInit()', () => {
      it('initializes correctly with an address', () => {
        componentUnderTest.address = mockAddress;
        componentUnderTest.items = items;
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.items).toEqual([
          { name: 'address', value: '123 Oak Street' },
          { name: 'state', value: 'CO' },
          { name: 'country', value: 'USA' },
          { name: 'zipcode', value: '11111' },
          { name: 'phone', value: '2223334444' },
          { name: 'city', value: 'Denver' }
        ]);
      });

      it('initializes correctly without an address', () => {
        componentUnderTest.address = null;
        componentUnderTest.items = items;
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.items).toEqual(items);
      });
    });
  });
}
