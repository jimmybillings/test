import { AssetComponent } from './asset.component';

export function main() {
  describe('Asset Component', () => {
    let componentUnderTest: AssetComponent;

    beforeEach(() => {
      componentUnderTest = new AssetComponent();
    });

    describe('initialization', () => {
      it('caches the asset\'s metadata', () => {
        componentUnderTest.asset = {
          assetId: 0,
          assetName: '',
          timeStart: 0,
          timeEnd: 0,
          thumbnailUrl: '',
          metadata: [
            { name: 'a', value: 'b' },
            { name: 'c', value: 'd' }
          ]
        };

        componentUnderTest.ngOnInit();

        expect(componentUnderTest.metadata).toEqual({ a: 'b', c: 'd' });
      });
    });
  });
};
