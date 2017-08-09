import { CommerceComponent } from './commerce.component';

export function main() {
  xdescribe('Commerce Component', () => {
    let componentUnderTest: CommerceComponent;

    beforeEach(() => {
      componentUnderTest = new CommerceComponent();
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};
