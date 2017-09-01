import { SearchAssetEffects } from './search-asset.effects';
import * as SearchAssetActions from '../actions/search-asset.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';
import { Frame } from 'wazee-frame-formatter';

export function main() {
  let mockLocation: any, mockRouter: any;

  describe('Search Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      mockLocation = { go: jasmine.createSpy('go') };
      mockRouter = { routerState: { snapshot: { url: '/search/asset/1234567' } } };

      return new SearchAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService,
        mockRouter, mockLocation
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SearchAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      serviceMethod: {
        name: 'load',
        expectedArguments: [{ some: 'loadParameters' }],
        returnsObservableOf: { some: 'asset' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'searchAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'asset' }]
        },
        failure: {
          sectionName: 'searchAsset',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'updateMarkersInUrl',
      comment: 'with good markers',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SearchAssetActions.UpdateMarkersInUrl.Type,
        markers: { in: new Frame(30).setFromSeconds(10), out: new Frame(30).setFromSeconds(20) },
        assetId: 100
      },
      customTests: [
        {
          it: 'calls .go() on the location service',
          expectation: () => {
            expect(mockLocation.go).toHaveBeenCalledWith('/search/asset/100;timeStart=10000;timeEnd=20000');
          }
        }
      ]
    });

    // Possible bug: timeStart=undefined;timeEnd=undefined, but it existed at the time of adding this test,
    // So I'm not going to modify the original code. -R.E. 9/1/17
    effectsSpecHelper.generateTestsFor({
      effectName: 'updateMarkersInUrl',
      comment: 'with bad markers',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SearchAssetActions.UpdateMarkersInUrl.Type,
        markers: { in: undefined, out: undefined },
        assetId: 100
      },
      customTests: [
        {
          it: 'calls .go() on the location service',
          expectation: () => {
            expect(mockLocation.go).toHaveBeenCalledWith('/search/asset/100;timeStart=undefined;timeEnd=undefined');
          }
        }
      ]
    });
  });
}
