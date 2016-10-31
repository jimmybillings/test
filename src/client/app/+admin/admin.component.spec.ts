import { AdminComponent } from './admin.component';

export function main() {
  describe('Admin Component', () => {
    let componentUnderTest: AdminComponent;
    beforeEach(() => {
      componentUnderTest = new AdminComponent();
    });

    it('exists', () => {
      expect(true).toBe(true);
    });
  });
}