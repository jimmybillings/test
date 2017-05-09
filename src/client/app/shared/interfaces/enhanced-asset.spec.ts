import { Frame } from 'wazee-frame-formatter';
import { EnhancedAsset } from './enhanced-asset';

export function main() {
  describe('Enhanced Asset', () => {
    let assetUnderTest: EnhancedAsset;
    const durationInFrames: number = 400;

    const generateFrameTestsFrom: Function = (
      tests: any[],
      frameGetterName: string,
      frameNumberGetterName: string,
      millisecondsGetterName: string = undefined,
      percentageGetterName: string = undefined
    ) => {
      for (const test of tests) {
        const expectedResultDescription: string = test.expected ? 'the expected values' : 'undefined';

        it(`return ${expectedResultDescription} when the asset ${test.condition}`, () => {
          Object.assign(
            assetUnderTest,
            { metadata: [] },
            test.hasOwnProperty('timeStart') ? { timeStart: test.timeStart } : null,
            test.hasOwnProperty('timeEnd') ? { timeEnd: test.timeEnd } : null
          );

          if (test.frameRate) assetUnderTest.metadata[0] = { name: 'Format.FrameRate', value: '30 fps' };
          if (test.duration) assetUnderTest.metadata[1] = { name: 'Format.Duration', value: `${1000 * durationInFrames / 30}` };

          if (test.expected >= 0) {
            const expectedFrame: Frame = new Frame(30).setFromFrameNumber(test.expected);

            expect((assetUnderTest as any)[frameGetterName]).toEqual(expectedFrame);
            expect((assetUnderTest as any)[frameNumberGetterName]).toEqual(test.expected);
            if (millisecondsGetterName) {
              expect((assetUnderTest as any)[millisecondsGetterName]).toEqual(expectedFrame.asSeconds() * 1000);
            }
            if (percentageGetterName) {
              expect((assetUnderTest as any)[percentageGetterName])
                .toEqual(test.duration ? test.expected * 100 / durationInFrames : 0);
            }
          } else {
            expect((assetUnderTest as any)[frameGetterName]).toBeUndefined();
            expect((assetUnderTest as any)[frameNumberGetterName]).toBeUndefined();
            if (millisecondsGetterName) {
              expect((assetUnderTest as any)[millisecondsGetterName]).toBeUndefined();
            }
            if (percentageGetterName) {
              expect((assetUnderTest as any)[percentageGetterName]).toBe(0);
            }
          }
        });
      }
    };

    beforeEach(() => {
      assetUnderTest = new EnhancedAsset();
    });

    describe('durationFrame and durationFrameNumber getters', () => {
      const tests: any = [
        { condition: 'has no duration and no frame rate', expected: undefined },
        { condition: 'has only a frame rate', frameRate: true, expected: undefined },
        { condition: 'has only a duration', duration: true, expected: undefined },
        { condition: 'has a duration and a frame rate', duration: true, frameRate: true, expected: durationInFrames },
      ];

      generateFrameTestsFrom(tests, 'durationFrame', 'durationFrameNumber');
    });

    describe('durationMilliseconds getter', () => {
      let returnedMetadataValue: string;

      beforeEach(() => {
        returnedMetadataValue = '12345678';
        spyOn(assetUnderTest, 'getMetadataValueFor').and.callFake(() => returnedMetadataValue);
      });

      it('returns the number from the metadata value', () => {
        expect(assetUnderTest.durationMilliseconds).toEqual(12345678);
      });

      it('assumes milliseconds value is integral', () => {
        returnedMetadataValue = '12345678.9';

        expect(assetUnderTest.durationMilliseconds).toEqual(12345678);
      });

      it('returns undefined if the asset is missing the needed metadata', () => {
        returnedMetadataValue = undefined;

        expect(assetUnderTest.durationMilliseconds).toBeUndefined();
      });

      it('caches its value', () => {
        let value: number = assetUnderTest.durationMilliseconds;
        value = assetUnderTest.durationMilliseconds;

        expect(assetUnderTest.getMetadataValueFor).toHaveBeenCalledTimes(1);
      });
    });

    describe(
      'subclipDurationFrame, subclipDurationFrameNumber, subclipDurationMilliseconds, and subclipDurationPercentage getters',
      () => {
        const tests: any = [
          { condition: 'has no timeStart, no timeEnd, no duration, and no frame rate', expected: undefined },
          { condition: 'has only a frame rate', frameRate: true, expected: undefined },
          { condition: 'has only a duration', duration: true, expected: undefined },
          { condition: 'has a duration and a frame rate', duration: true, frameRate: true, expected: durationInFrames - 0 },
          { condition: 'has only a timeEnd', timeEnd: 200, expected: undefined },
          { condition: 'has a timeEnd and a frame rate', timeEnd: 200, frameRate: true, expected: 200 - 0 },
          { condition: 'has a timeEnd and a duration', timeEnd: 200, duration: true, expected: undefined },
          {
            condition: 'has a timeEnd, a duration, and a frame rate',
            timeEnd: 200, duration: true, frameRate: true, expected: 200 - 0
          },
          { condition: 'has only a timeStart', timeStart: 100, expected: undefined },
          { condition: 'has a timeStart and a frame rate', timeStart: 100, frameRate: true, expected: undefined },
          { condition: 'has a timeStart and a duration', timeStart: 100, duration: true, expected: undefined },
          {
            condition: 'has a timeStart, a frame rate, and a duration',
            timeStart: 100, frameRate: true, duration: true, expected: durationInFrames - 100
          },
          { condition: 'has a timeStart and a timeEnd', timeStart: 100, timeEnd: 200, expected: undefined },
          {
            condition: 'has a timeStart, a timeEnd, and a frame rate',
            timeStart: 100, timeEnd: 200, frameRate: true, expected: 200 - 100
          },
          {
            condition: 'has a timeStart, a timeEnd, and a duration',
            timeStart: 100, timeEnd: 200, duration: true, expected: undefined
          },
          {
            condition: 'has a timeStart, a timeEnd, a duration, and a frame rate',
            timeStart: 100, timeEnd: 200, duration: true, frameRate: true, expected: 200 - 100
          }
        ];

        generateFrameTestsFrom(
          tests, 'subclipDurationFrame', 'subclipDurationFrameNumber', 'subclipDurationMilliseconds', 'subclipDurationPercentage'
        );
      });

    describe('inMarkerFrame, inMarkerFrameNumber, inMarkerMilliseconds, and inMarkerPercentage getters', () => {
      const tests: any = [
        { condition: 'has no timeStart and no frame rate', expected: undefined },
        { condition: 'has only a frame rate', frameRate: true, expected: 0 },
        { condition: 'has only a positive timeStart', timeStart: 100, expected: undefined },
        { condition: 'has a positive timeStart and a frame rate', timeStart: 100, frameRate: true, expected: 100 },
        { condition: 'has only a zero timeStart', timeStart: 0, expected: undefined },
        { condition: 'has a zero timeStart and a frame rate', timeStart: 0, frameRate: true, expected: 0 },
        { condition: 'has only a negative timeStart', timeStart: -1, expected: undefined },
        { condition: 'has a negative timeStart and a frame rate', timeStart: -1, frameRate: true, expected: 0 }
      ];

      generateFrameTestsFrom(tests, 'inMarkerFrame', 'inMarkerFrameNumber', 'inMarkerMilliseconds', 'inMarkerPercentage');
    });

    describe('outMarkerFrame, outMarkerFrameNumber, outMarkerMilliseconds, and outMarkerPercentage getters', () => {
      const tests: any = [
        { condition: 'has no timeEnd, no duration, and no frame rate', expected: undefined },
        { condition: 'has only a frame rate', frameRate: true, expected: undefined },
        { condition: 'has only a duration', duration: true, expected: undefined },
        { condition: 'has a duration and a frame rate', duration: true, frameRate: true, expected: durationInFrames },
        { condition: 'has only a positive timeEnd', timeEnd: 200, expected: undefined },
        { condition: 'has a positive timeEnd and a frame rate', timeEnd: 200, frameRate: true, expected: 200 },
        { condition: 'has a positive timeEnd and a duration', timeEnd: 200, duration: true, expected: undefined },
        {
          condition: 'has a positive timeEnd, a duration, and a frame rate',
          timeEnd: 200, duration: true, frameRate: true, expected: 200
        },
        { condition: 'has only a zero timeEnd', timeEnd: 0, expected: undefined },
        { condition: 'has a zero timeEnd and a frame rate', timeEnd: 0, frameRate: true, expected: 0 },
        { condition: 'has a zero timeEnd and a duration', timeEnd: 0, duration: true, expected: undefined },
        {
          condition: 'has a zero timeEnd, a duration, and a frame rate',
          timeEnd: 0, duration: true, frameRate: true, expected: 0
        },
        { condition: 'has only a negative timeEnd', timeEnd: -2, expected: undefined },
        { condition: 'has a negative timeEnd and a frame rate', timeEnd: -2, frameRate: true, expected: undefined },
        { condition: 'has a negative timeEnd and a duration', timeEnd: -2, duration: true, expected: undefined },
        {
          condition: 'has a negative timeEnd, a duration, and a frame rate',
          timeEnd: -2, duration: true, frameRate: true, expected: durationInFrames
        }
      ];

      generateFrameTestsFrom(tests, 'outMarkerFrame', 'outMarkerFrameNumber', 'outMarkerMilliseconds', 'outMarkerPercentage');
    });

    describe('getMetadataValueFor()', () => {
      beforeEach(() => {
        Object.assign(assetUnderTest, { metadata: [] });
        assetUnderTest.metadata[42] = { name: 'Some.Name', value: 'some value' };
        assetUnderTest.metadata[47] = { name: 'Some.Other.Name', value: 'some other value' };
      });

      it('returns the expected metadata', () => {
        expect(assetUnderTest.getMetadataValueFor('Some.Name')).toEqual('some value');
        expect(assetUnderTest.getMetadataValueFor('Some.Other.Name')).toEqual('some other value');
      });

      it('returns undefined for a name that doesn\'t exist', () => {
        expect(assetUnderTest.getMetadataValueFor('Some.Nonexistent.Name')).toBeUndefined();
      });

      it('returns undefined for a name that doesn\'t have a value', () => {
        assetUnderTest.metadata[0] = { name: 'Yet.Another.Name' } as any;

        expect(assetUnderTest.getMetadataValueFor('Yet.Another.Name')).toBeUndefined();
      });

      it('is not confused by empty elements in the metadata array', () => {
        assetUnderTest.metadata[0] = {} as any;

        expect(assetUnderTest.getMetadataValueFor('Some.Name')).toEqual('some value');
      });

      it('is not confused by undefined elements in the metadata array', () => {
        assetUnderTest.metadata[0] = undefined;

        expect(assetUnderTest.getMetadataValueFor('Some.Name')).toEqual('some value');
      });

      it('is not confused by null elements in the metadata array', () => {
        assetUnderTest.metadata[0] = null;

        expect(assetUnderTest.getMetadataValueFor('Some.Name')).toEqual('some value');
      });
    });

    describe('convertMetadataValueFor()', () => {
      beforeEach(() => {
        Object.assign(assetUnderTest, { metadata: [] });
      });

      it('returns the return value of the passed-in function applied to the metadata value', () => {
        Object.assign(assetUnderTest, { metadata: [{ name: 'Some.Name', value: '3.14 bottles of beer on the wall' }] });

        expect(assetUnderTest.convertMetadataValueFor('Some.Name', value => parseFloat(value) * 2)).toEqual(6.28);
      });

      it('returns undefined if the asset is missing the requested metadata', () => {
        expect(assetUnderTest.convertMetadataValueFor('Some.Name', value => parseFloat(value) * 2)).toBeUndefined();
      });
    });

    describe('resourceClass getter', () => {
      let returnedMetadataValue: string;

      beforeEach(() => {
        returnedMetadataValue = 'Image';
        spyOn(assetUnderTest, 'getMetadataValueFor').and.callFake(() => returnedMetadataValue);
      });

      it('returns "Image" for an image', () => {
        expect(assetUnderTest.resourceClass).toEqual('Image');
      });

      it('returns undefined if the asset is missing the needed metadata', () => {
        returnedMetadataValue = undefined;

        expect(assetUnderTest.resourceClass).toBeUndefined();
      });

      it('caches its value', () => {
        let value: string = assetUnderTest.resourceClass;
        value = assetUnderTest.resourceClass;

        expect(assetUnderTest.getMetadataValueFor).toHaveBeenCalledTimes(1);
      });
    });

    describe('isImage getter', () => {
      let returnedMetadataValue: string;

      beforeEach(() => {
        returnedMetadataValue = 'Image';
        spyOn(assetUnderTest, 'getMetadataValueFor').and.callFake(() => returnedMetadataValue);
      });

      it('returns true for an image', () => {
        expect(assetUnderTest.isImage).toBe(true);
      });

      it('returns false for a non-image', () => {
        returnedMetadataValue = 'blah';

        expect(assetUnderTest.isImage).toBe(false);
      });

      it('returns false if the asset is missing the needed metadata', () => {
        returnedMetadataValue = undefined;

        expect(assetUnderTest.isImage).toBe(false);
      });
    });

    describe('framesPerSecond getter', () => {
      let returnedMetadataValue: string;

      beforeEach(() => {
        returnedMetadataValue = '29.97 fps';
        spyOn(assetUnderTest, 'getMetadataValueFor').and.callFake(() => returnedMetadataValue);
      });

      it('returns the number from the metadata value', () => {
        expect(assetUnderTest.framesPerSecond).toEqual(29.97);
      });

      it('returns undefined if the asset is missing the needed metadata', () => {
        returnedMetadataValue = undefined;

        expect(assetUnderTest.framesPerSecond).toBeUndefined();
      });

      it('caches its value', () => {
        let value: number = assetUnderTest.framesPerSecond;
        value = assetUnderTest.framesPerSecond;

        expect(assetUnderTest.getMetadataValueFor).toHaveBeenCalledTimes(1);
      });
    });

    describe('isSubclipped getter', () => {
      const tests: any = [
        { condition: 'has no timeStart and no timeEnd', expected: false },

        { condition: 'has only a positive timeStart', timeStart: 100, expected: true },
        { condition: 'has only a zero timeStart', timeStart: 0, expected: true },
        { condition: 'has only a negative timeStart', timeStart: -1, expected: false },

        { condition: 'has only a positive timeEnd', timeEnd: 200, expected: true },
        { condition: 'has only a zero timeEnd', timeEnd: 0, expected: true },
        { condition: 'has only a negative timeEnd', timeEnd: -2, expected: false },

        { condition: 'has a positive timeStart and a positive timeEnd', timeStart: 100, timeEnd: 200, expected: true },
        { condition: 'has a zero timeStart and a positive timeEnd', timeStart: 0, timeEnd: 200, expected: true },
        { condition: 'has a negative timeStart and a positive timeEnd', timeStart: -1, timeEnd: 200, expected: true },

        { condition: 'has a positive timeStart and a zero timeEnd', timeStart: 100, timeEnd: 0, expected: true },
        { condition: 'has a zero timeStart and a zero timeEnd', timeStart: 0, timeEnd: 0, expected: true },
        { condition: 'has a negative timeStart and a zero timeEnd', timeStart: -1, timeEnd: 0, expected: true },

        { condition: 'has a positive timeStart and a negative timeEnd', timeStart: 100, timeEnd: -2, expected: true },
        { condition: 'has a zero timeStart and a negative timeEnd', timeStart: 0, timeEnd: -2, expected: true },
        { condition: 'has a negative timeStart and a negative timeEnd', timeStart: -1, timeEnd: -2, expected: false }
      ];

      for (const test of tests) {
        it(`returns ${test.expected} for an asset that ${test.condition}`, () => {
          Object.assign(
            assetUnderTest,
            { metadata: [] },
            test.hasOwnProperty('timeStart') ? { timeStart: test.timeStart } : null,
            test.hasOwnProperty('timeEnd') ? { timeEnd: test.timeEnd } : null
          );

          expect(assetUnderTest.isSubclipped).toBe(test.expected);
        });
      }
    });
  });
}
