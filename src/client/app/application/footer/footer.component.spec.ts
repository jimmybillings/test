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

    describe('privacyPolicyExists', () => {
      it('returns true when the config is loaded and has a privacyPolicyId value', () => {
        mockStore.createStateSection('uiConfig', {
          loaded: true, components: { footer: { config: { privacyPolicyId: { value: '1' } } } }
        });
        componentUnderTest.ngOnInit();
        let exists: boolean;
        componentUnderTest.privacyPolicyExists.take(1).subscribe(e => exists = e);
        expect(exists).toBe(true);
      });

      describe('returns false', () => {
        it('when the config is not yet loaded', () => {
          mockStore.createStateSection('uiConfig', { loaded: false });
          componentUnderTest.ngOnInit();
          let exists: boolean;
          componentUnderTest.privacyPolicyExists.take(1).subscribe(e => exists = e);
          expect(exists).toBe(undefined);
        });

        it('when the config does not have a privacyPolicyId value', () => {
          mockStore.createStateSection('uiConfig', { loaded: true, components: { footer: { config: {} } } });
          componentUnderTest.ngOnInit();
          let exists: boolean;
          componentUnderTest.privacyPolicyExists.take(1).subscribe(e => exists = e);
          expect(exists).toBe(false);
        });
      });
    });
  });
}
