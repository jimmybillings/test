import { AddressFormComponent } from './address-form.component';

export function main() {
  describe('Address Form Component', () => {
    let componentUnderTest: AddressFormComponent;

    beforeEach(() => {
      componentUnderTest = new AddressFormComponent();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
