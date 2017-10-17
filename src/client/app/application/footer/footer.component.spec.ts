import { FooterComponent } from './footer.component';
import { Observable } from 'rxjs/Observable';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  let componentUnderTest: FooterComponent;
  let mockStore: MockAppStore;

  describe('Footer Component', () => {
    beforeEach(() => {
      mockStore = new MockAppStore();
      mockStore.createStateSection('uiConfig', { loaded: true, components: { footer: { config: { some: 'config' } } } });

      componentUnderTest = new FooterComponent(mockStore);
    });

    describe('ngOnInit()', () => {
      it('should assign the "config" variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ some: 'config' });
      });
    });
  });
}
