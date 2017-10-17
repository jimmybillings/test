import { ActiveCollectionAssetEffects } from './active-collection-asset.effects';
import * as ActiveCollectionAssetActions from './active-collection-asset.actions';
import * as ActiveCollectionActions from '../active-collection/active-collection.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Active Collection Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new ActiveCollectionAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAfterCollectionAvailable',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionAssetActions.LoadAfterCollectionAvailable.Type,
        loadParameters: { id: '50', uuid: 'abc-123' }
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { assetId: '50' },
        expectedArguments: [{ id: '50', uuid: 'abc-123' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollectionAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ assetId: '50' }]
        },
        failure: {
          sectionName: 'activeCollectionAsset',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the collection is NOT yet loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'activeCollection',
        value: { collection: { id: null } }
      },
      inputAction: {
        type: ActiveCollectionAssetActions.Load.Type,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollection',
          methodName: 'load',
          expectedArguments: []
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the collection IS loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'activeCollection',
        value: { collection: { id: 1, assets: { items: [{ assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 }] } } }
      },
      inputAction: {
        type: ActiveCollectionAssetActions.Load.Type,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollectionAsset',
          methodName: 'loadAfterCollectionAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAssetOnCollectionLoadSuccess',
      comment: 'when the asset store HAS load parameters',
      effectsInstantiator: instantiator,
      state: [
        {
          storeSectionName: 'activeCollectionAsset',
          propertyName: 'loadingUuid',
          value: 'abc-123'
        },
        {
          storeSectionName: 'activeCollection',
          value: { collection: { id: 1, assets: { items: [{ assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 }] } } }
        }
      ],
      inputAction: {
        type: ActiveCollectionActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollectionAsset',
          methodName: 'loadAfterCollectionAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAssetOnCollectionLoadSuccess',
      comment: 'when the asset UUID doesn\'t exist in the collection',
      effectsInstantiator: instantiator,
      state: [
        {
          storeSectionName: 'activeCollectionAsset',
          propertyName: 'loadingUuid',
          value: 'xyz-not-present'
        },
        {
          storeSectionName: 'activeCollection',
          value: { collection: { id: 1, assets: { items: [{ assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 }] } } }
        }
      ],
      inputAction: {
        type: ActiveCollectionActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollectionAsset',
          methodName: 'loadFailure',
          expectedArguments: [{ status: 404 }]
        }
      }
    });
  });
}
