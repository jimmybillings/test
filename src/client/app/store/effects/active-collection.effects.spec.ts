import { ActiveCollectionEffects } from './active-collection.effects';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { EffectsSpecHelper, EffectTestParameters, EffectTestState } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Active Collection Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();
    let mockUserPreferenceService: any;
    let mockRouter: any;

    function instantiator(): ActiveCollectionEffects {
      return new ActiveCollectionEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService,
        mockUserPreferenceService, mockRouter
      );
    }

    beforeEach(() => {
      mockUserPreferenceService = { openCollectionTray: jasmine.createSpy('openCollectionTray') };
      mockRouter = {
        navigate: jasmine.createSpy('navigate'),
        routerState: { snapshot: { url: '/blahblahblah/asset/blahblahblah' } }
      };
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.Load.Type,
        pagination: { some: 'pagination' }
      },
      serviceMethod: {
        name: 'load',
        expectedArguments: [{ some: 'pagination' }],
        returnsObservableOf: { some: 'collection' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollection',
          methodName: 'loadSuccess',
          expectedArguments: [{ some: 'collection' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'set',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.Set.Type,
        collectionId: 42,
        pagination: { some: 'pagination' }
      },
      serviceMethod: {
        name: 'set',
        expectedArguments: [42, { some: 'pagination' }],
        returnsObservableOf: { some: 'collection' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollection',
          methodName: 'setSuccess',
          expectedArguments: [{ some: 'collection' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadPage',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.LoadPage.Type,
        pagination: { some: 'pagination' }
      },
      state: {
        storeSectionName: 'activeCollection',
        propertyName: 'collection',
        value: { id: 123 }
      },
      serviceMethod: {
        name: 'loadPage',
        expectedArguments: [123, { some: 'pagination' }],
        returnsObservableOf: { some: 'collection' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollection',
          methodName: 'loadPageSuccess',
          expectedArguments: [{ some: 'collection' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'openTrayOnAddOrRemove',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.AddAsset.Type
      },
      customTests: [{
        it: 'works for AddAsset action',
        expectation: () => {
          expect(mockUserPreferenceService.openCollectionTray).toHaveBeenCalled();
        }
      }]
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'openTrayOnAddOrRemove',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.RemoveAsset.Type
      },
      customTests: [{
        it: 'works for RemoveAsset action',
        expectation: () => {
          expect(mockUserPreferenceService.openCollectionTray).toHaveBeenCalled();
        }
      }]
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'addAsset',
      comment: 'with a new asset',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.AddAsset.Type,
        asset: { some: 'asset' },
        markers: { some: 'markers' }
      },
      state: {
        storeSectionName: 'activeCollection',
        propertyName: 'collection',
        value: { some: 'collection' }
      },
      serviceMethod: {
        name: 'addAssetTo',
        expectedArguments: [{ some: 'collection' }, { some: 'asset' }, { some: 'markers' }],
        returnsObservableOf: { items: ['something'] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollection',
          methodName: 'addAssetSuccess',
          expectedArguments: [{ items: ['something'] }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'addAsset',
      comment: 'with an asset already in the collection',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.AddAsset.Type,
        asset: { some: 'asset' },
        markers: { some: 'markers' }
      },
      state: {
        storeSectionName: 'activeCollection',
        propertyName: 'collection',
        value: { name: 'some-collection' }
      },
      serviceMethod: {
        name: 'addAssetTo',
        expectedArguments: [{ name: 'some-collection' }, { some: 'asset' }, { some: 'markers' }],
        returnsObservableOf: { items: [] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['COLLECTION.ALREADY_IN_COLLECTION_TOAST', { collectionName: 'some-collection' }]
        }
      }
    });


    effectsSpecHelper.generateTestsFor({
      effectName: 'showSnackBarOnAddSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.AddAssetSuccess.Type,
        currentPage: { some: 'assets' }
      },
      state: {
        storeSectionName: 'activeCollection',
        propertyName: 'collection',
        value: { name: 'someCollectionName' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['COLLECTION.ADD_TO_COLLECTION_TOAST', { collectionName: 'someCollectionName' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'maybeChangeAssetRouteOnAddSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.AddAssetSuccess.Type
      },
      state: [
        {
          storeSectionName: 'activeCollectionAsset',
          propertyName: 'activeAsset',
          value: { assetId: 123 }
        },
        {
          storeSectionName: 'activeCollection',
          value: {
            latestAddition: {
              asset: { assetId: 123 },
              markers: {
                in: { frameNumber: 30, framesPerSecond: 30 },
                out: { frameNumber: 60, framesPerSecond: 30 }
              }
            },
            collection: {
              id: 555,
              assets: {
                items: [
                  {
                    assetId: 123,
                    uuid: 'ABCD',
                    timeStart: 1000,
                    timeEnd: 2000
                  },
                  {
                    assetId: 123,
                    uuid: 'EFGH'
                  }
                ]
              }
            }
          }
        }
      ],
      customTests: [
        {
          it: 'does nothing if the active route does not contain /asset',
          beforeInstantiation: () => {
            mockRouter.routerState.snapshot.url = '/something/else';
          },
          expectation: () => {
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }
        },
        {
          it: 'does nothing if the added asset ID does not match the currently displayed asset',
          stateOverrider: (originalState: EffectTestState[]): EffectTestState[] => {
            return [
              originalState[0],
              {
                ...originalState[1],
                value: {
                  ...originalState[1].value,
                  latestAddition: {
                    asset: { assetId: 456 }
                  }
                }
              }
            ];
          },
          expectation: () => {
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }
        },
        {
          it: 'otherwise activates a route for a newly added asset',
          expectation: () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(
              ['/collections/555/asset/123', { uuid: 'ABCD', timeStart: '1000', timeEnd: '2000' }]
            );
          }
        },
        {
          it: 'otherwise activates a route for a newly added asset without markers',
          stateOverrider: (originalState: EffectTestState[]): EffectTestState[] => {
            return [
              originalState[0],
              {
                ...originalState[1],
                value: {
                  ...originalState[1].value,
                  latestAddition: {
                    asset: { assetId: 123 }
                  }
                }
              }
            ];
          },
          expectation: () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/collections/555/asset/123', { uuid: 'EFGH' }]);
          }
        }
      ]
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'removeAsset',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.RemoveAsset.Type,
        asset: { some: 'asset' }
      },
      state: {
        storeSectionName: 'activeCollection',
        propertyName: 'collection',
        value: { some: 'collection' }
      },
      serviceMethod: {
        name: 'removeAssetFrom',
        expectedArguments: [{ some: 'collection' }, { some: 'asset' }],
        returnsObservableOf: { some: 'assets' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollection',
          methodName: 'removeAssetSuccess',
          expectedArguments: [{ some: 'assets' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'showSnackBarOnRemoveSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.RemoveAssetSuccess.Type,
        currentPageItems: { some: 'assets' }
      },
      state: {
        storeSectionName: 'activeCollection',
        propertyName: 'collection',
        value: { name: 'someCollectionName' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'snackbar',
          methodName: 'display',
          expectedArguments: ['COLLECTION.REMOVE_FROM_COLLECTION_TOAST', { collectionName: 'someCollectionName' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'maybeChangeAssetRouteOnRemoveSuccess',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.RemoveAssetSuccess.Type
      },
      state: [
        {
          storeSectionName: 'activeCollectionAsset',
          propertyName: 'activeAsset',
          value: { assetId: 123, uuid: 'ABCD' }
        },
        {
          storeSectionName: 'activeCollection',
          value: {
            latestRemoval: {
              assetId: 123,
              uuid: 'ABCD'
            },
            collection: {
              id: 555,
              assets: {
                items: [
                  {
                    assetId: 123,
                    uuid: 'EFGH'
                  },
                  {
                    assetId: 123,
                    uuid: 'IJKL'
                  }
                ]
              }
            }
          }
        }
      ],
      customTests: [
        {
          it: 'does nothing if the active route does not contain /asset',
          beforeInstantiation: () => {
            mockRouter.routerState.snapshot.url = '/something/else';
          },
          expectation: () => {
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }
        },
        {
          it: 'does nothing if the removed asset ID does not match the currently displayed asset',
          stateOverrider: (originalState: EffectTestState[]) => {
            return [
              originalState[0],
              {
                ...originalState[1],
                value: {
                  ...originalState[1].value,
                  latestRemoval: {
                    asset: { assetId: 456 }
                  }
                }
              }
            ];
          },
          expectation: () => {
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }
        },
        {
          it: 'does nothing if the removed asset UUID does not match the currently displayed asset',
          stateOverrider: (originalState: EffectTestState[]) => {
            return [
              originalState[0],
              {
                ...originalState[1],
                value: {
                  ...originalState[1].value,
                  latestRemoval: {
                    asset: { uuid: 'MNOP' }
                  }
                }
              }
            ];
          },
          expectation: () => {
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }
        },
        {
          it: 'otherwise activates a route for the first collection asset it finds with the same asset ID',
          expectation: () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/collections/555/asset/123', { uuid: 'EFGH' }]);
          }
        },
        {
          it: 'otherwise activates a route with the same asset ID and no UUID if no instances of asset ID remain',
          stateOverrider: (originalState: EffectTestState[]) => {
            return [
              originalState[0],
              {
                ...originalState[1],
                value: {
                  ...originalState[1].value,
                  collection: { id: 555, assets: { items: [] } }
                }
              }
            ];
          },
          expectation: () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/collections/555/asset/123', {}]);
          }
        },
      ]
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'updateAssetMarkers',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionActions.UpdateAssetMarkers.Type,
        asset: { some: 'asset' },
        markers: { some: 'markers' }
      },
      state: {
        storeSectionName: 'activeCollection',
        propertyName: 'collection',
        value: { some: 'collection' }
      },
      serviceMethod: {
        name: 'updateAssetMarkers',
        expectedArguments: [{ some: 'collection' }, { some: 'asset' }, { some: 'markers' }],
        returnsObservableOf: { some: 'assets' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'activeCollection',
          methodName: 'updateAssetMarkersSuccess',
          expectedArguments: [{ some: 'assets' }]
        }
      }
    });
  });
}
