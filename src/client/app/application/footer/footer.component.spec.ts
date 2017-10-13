import { FooterComponent } from './footer.component';
import { Observable } from 'rxjs/Observable';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  let componentUnderTest: FooterComponent;
  let mockStore: MockAppStore;

  describe('Footer Component', () => {
    beforeEach(() => {
      mockStore = new MockAppStore();
      mockStore.createStateSection('uiConfig', { components: { footer: { config: { some: 'config' } } } });

      componentUnderTest = new FooterComponent(mockStore);
      componentUnderTest.supportedLanguages = [{ code: 'en', title: 'English' }, { code: 'fr', title: 'French' }];
    });

    describe('ngOnInit()', () => {
      it('should assign the "lang" variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.lang).toBe('en');
      });

      it('should assign the "config" variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ some: 'config' });
      });
    });
  });
}
