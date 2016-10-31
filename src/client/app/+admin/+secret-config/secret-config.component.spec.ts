import { SecretConfigComponent } from './secret-config.component';

export function main() {
  describe('Secret Config Component', () => {
    let componentUnderTest: SecretConfigComponent;

    beforeEach(() => {
      componentUnderTest = new SecretConfigComponent(null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

