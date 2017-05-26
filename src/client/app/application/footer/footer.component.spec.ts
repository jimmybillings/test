import { FooterComponent } from './footer.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  let componentUnderTest: FooterComponent, mockUiConfig: any;

  describe('Footer Component', () => {
    beforeEach(() => {
      mockUiConfig = { get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { some: 'config' } })) };
      componentUnderTest = new FooterComponent(mockUiConfig);
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

    describe('selectLang()', () => {
      it('Should fire an event to change the current selected language', () => {
        spyOn(componentUnderTest.onChangeLang, 'emit');
        componentUnderTest.selectLang({ value: 'fr' });
        expect(componentUnderTest.onChangeLang.emit).toHaveBeenCalledWith('fr');
      });
    });
  });
}
