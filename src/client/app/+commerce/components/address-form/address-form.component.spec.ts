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
      componentUnderTest = new AddressFormComponent(null, null);
    });
  });
}
