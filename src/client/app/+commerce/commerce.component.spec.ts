import { CommerceComponent } from './commerce.component';

export function main() {
  describe('Commerce Component', () => {
    let componentUnderTest: CommerceComponent;

    beforeEach(() => {
      componentUnderTest = new CommerceComponent();
    });

    it('has no testable functionality', () => {
      expect(true).toBe(true);
    });
  });
};
