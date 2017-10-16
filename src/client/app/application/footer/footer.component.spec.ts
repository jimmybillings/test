import { FooterComponent } from './footer.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  let componentUnderTest: FooterComponent, mockUiConfig: any;

  describe('Footer Component', () => {
    beforeEach(() => {
      mockUiConfig = { get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { some: 'config' } })) };
      componentUnderTest = new FooterComponent(mockUiConfig);
    });

    describe('ngOnInit()', () => {
      it('should assign the "config" variable', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.config).toEqual({ some: 'config' });
      });
    });
  });
}
