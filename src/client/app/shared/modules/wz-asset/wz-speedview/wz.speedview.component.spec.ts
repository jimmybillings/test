import { WzSpeedviewComponent } from './wz.speedview.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Wz Speedview Component', () => {
    let componentUnderTest: WzSpeedviewComponent, mockChangeDetector: any = {};

    beforeEach(() => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
      mockChangeDetector.markForCheck = jasmine.createSpy('markForCheck');
      componentUnderTest = new WzSpeedviewComponent(mockChangeDetector);
    });

    afterEach(() => jasmine.clock().uninstall());

    describe('speedviewAssetInfo', () => {
      it('Should initialize the SpeedViewAssetInfo object with valid values', () => {
        expect(componentUnderTest.speedviewAssetInfo)
          .toEqual({ values: [], url: '', pricingType: '', price: 0, imageQuickView: false });
      });
    });

    describe('visibility', () => {
      it('Should initialize the visibility variable to be hidden', () => {
        expect(componentUnderTest.visibility)
          .toBe('hidden');
      });
    });

    describe('translationReady()', () => {
      it('should accept a meta data key for parsing and return a translation key', () => {
        expect(componentUnderTest.translationReady('Format.Duration'))
          .toEqual('assetmetadata.Format_Duration');
      });
    });

    describe('merge()', () => {

      it('Should set only the posterUrl regardless of the other properties', () => {
        componentUnderTest.merge({ posterUrl: 'testPosterUrl' });
        expect(componentUnderTest.speedviewAssetInfo).toEqual({
          values: [],
          url: '',
          pricingType: '',
          price: 0,
          imageQuickView: false,
          posterUrl: 'testPosterUrl'
        });
      });

      it('Should set the noData property and remove everything else except for the posterUrl', () => {
        componentUnderTest.speedviewAssetInfo = {
          values: [],
          url: '',
          pricingType: '',
          price: 0,
          imageQuickView: false,
          posterUrl: 'testPosterUrl'
        };
        componentUnderTest.merge({ noData: true });
        expect(componentUnderTest.speedviewAssetInfo).toEqual({
          noData: true,
          posterUrl: 'testPosterUrl'
        });
      });

      it('Should set the noData property and remove everything else except for the posterUrl', () => {
        componentUnderTest.speedviewAssetInfo = {
          values: [],
          url: '',
          pricingType: '',
          price: 0,
          imageQuickView: false,
          posterUrl: 'testPosterUrl'
        };
        componentUnderTest.merge({ noData: true });
        expect(componentUnderTest.speedviewAssetInfo).toEqual({
          noData: true,
          posterUrl: 'testPosterUrl'
        });
      });

      it('Should set complete speedview data and remove the noData property if defined', () => {
        componentUnderTest.speedviewAssetInfo = {
          noData: true
        };
        componentUnderTest.merge({
          values: [],
          url: '',
          pricingType: '',
          price: 0,
          imageQuickView: false
        });
        expect(componentUnderTest.speedviewAssetInfo).toEqual({
          values: [],
          url: '',
          pricingType: '',
          price: 0,
          imageQuickView: false
        });
      });

      it('Should set complete speedview data and not attempt to remove the noData property if its undefined', () => {
        componentUnderTest.speedviewAssetInfo = {};
        componentUnderTest.merge({
          values: [],
          url: '',
          pricingType: '',
          price: 0,
          imageQuickView: false
        });
        expect(componentUnderTest.speedviewAssetInfo).toEqual({
          values: [],
          url: '',
          pricingType: '',
          price: 0,
          imageQuickView: false
        });
      });

      it('Should mannually fire the change detector when the SpeedViewData has been merged', () => {
        componentUnderTest.merge({ posterUrl: 'testPosterUrl' });
        expect(mockChangeDetector.markForCheck)
          .toHaveBeenCalled();
      });
    });

    describe('show()', () => {
      it('Should set the visible variable to visible after a 300ms timeout', () => {
        componentUnderTest.show();
        expect(componentUnderTest.visibility)
          .toBe('hidden');
        jasmine.clock().tick(340);
        expect(componentUnderTest.visibility)
          .toBe('visible');
      });

      it('Should mannually fire the change detector after a 300ms timeout', () => {
        componentUnderTest.show();
        expect(mockChangeDetector.markForCheck)
          .not.toHaveBeenCalled();
        jasmine.clock().tick(340);
        expect(mockChangeDetector.markForCheck)
          .toHaveBeenCalled();
      });
    });
  });
}
