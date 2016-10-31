import { SiteConfigComponent } from './site-config.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Site Config Component', () => {
    let componentUnderTest: SiteConfigComponent;
    let mockActivatedRoute: any;

    beforeEach(() => {
      mockActivatedRoute = { params: Observable.of({ site: 'core' }) };

      componentUnderTest = new SiteConfigComponent(mockActivatedRoute);
    });

    describe('initialization', () => {
      it('should subscribe to route params', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.siteName).toBe('core');
      });
    });
  });
}