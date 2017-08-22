import { ActiveCollectionEffects } from './active-collection.effects';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';
import { Frame } from 'wazee-frame-formatter';
export function main() {
  describe('Active Collection Effects', () => {
    let effectsSpecHelper: EffectsSpecHelper;
    let mockUserPreferenceService: any;
    let mockRouter: any;

    function instantiator(): ActiveCollectionEffects {
      return new ActiveCollectionEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService,
        mockUserPreferenceService, mockRouter
      );
    }

    beforeEach(() => {
      effectsSpecHelper = new EffectsSpecHelper();
      mockUserPreferenceService = { openCollectionTray: jasmine.createSpy('openCollectionTray') };
      mockRouter = {
        navigate: jasmine.createSpy('navigate'),
        routerState: { snapshot: { url: '/asset/blahblahblah' } }
      };
    });

    describe('load', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'activeCollection',
            methodName: 'loadSuccess',
            expectedArguments: [{ some: 'collection' }]
          }
        });
      });
    });

    describe('set', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'activeCollection',
            methodName: 'setSuccess',
            expectedArguments: [{ some: 'collection' }]
          }
        });
      });
    });

    describe('loadPage', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'activeCollection',
            methodName: 'loadPageSuccess',
            expectedArguments: [{ some: 'collection' }]
          }
        });
      });
    });

    describe('openTrayOnAddOrRemove', () => {
      it('works as expected for ActiveCollectionActions.AddAsset', () => {
        effectsSpecHelper.generateCustomTestFor(
          {
            effectName: 'openTrayOnAddOrRemove',
            effectsInstantiator: instantiator,
            inputAction: {
              type: ActiveCollectionActions.AddAsset.Type
            }
          },
          () => {
            expect(mockUserPreferenceService.openCollectionTray).toHaveBeenCalled();
          }
        );
      });

      it('works as expected for ActiveCollectionActions.RemoveAsset', () => {
        effectsSpecHelper.generateCustomTestFor(
          {
            effectName: 'openTrayOnAddOrRemove',
            effectsInstantiator: instantiator,
            inputAction: {
              type: ActiveCollectionActions.RemoveAsset.Type
            }
          },
          () => {
            expect(mockUserPreferenceService.openCollectionTray).toHaveBeenCalled();
          }
        );
      });
    });

    describe('addAsset', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'addAsset',
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
            returnsObservableOf: { some: 'assets' }
          },
          outputActionFactory: {
            sectionName: 'activeCollection',
            methodName: 'addAssetSuccess',
            expectedArguments: [{ some: 'assets' }]
          }
        });
      });
    });

    describe('showSnackBarOnAddSuccess', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'snackbar',
            methodName: 'display',
            expectedArguments: ['COLLECTION.ADD_TO_COLLECTION_TOAST', { collectionName: 'someCollectionName' }]
          }
        });
      });
    });

    fdescribe('maybeChangeAssetRouteOnAddSuccess', () => {
      let testParameters: EffectTestParameters;

      beforeEach(() => {
        testParameters = {
          effectName: 'maybeChangeAssetRouteOnAddSuccess',
          effectsInstantiator: instantiator,
          inputAction: {
            type: ActiveCollectionActions.AddAssetSuccess.Type
          },
          state: [
            {
              storeSectionName: 'asset',
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
          ]
        };
      });

      it('does nothing if the active route is not /asset', () => {
        mockRouter.routerState.snapshot.url = '/something/else';

        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('does nothing if the added asset ID does not match the currently displayed asset', () => {
        (testParameters.state as any)[1].value.latestAddition.asset.assetId = 456;

        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('otherwise activates a route for a newly added asset', () => {
        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', { uuid: 'ABCD', timeStart: '1000', timeEnd: '2000' }]);
        });
      });

      it('otherwise activates a route for a newly added asset without markers', () => {
        (testParameters.state as any)[1].value.latestAddition = { asset: { assetId: 123 } };

        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', { uuid: 'EFGH' }]);
        });
      });
    });

    describe('removeAsset', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'activeCollection',
            methodName: 'removeAssetSuccess',
            expectedArguments: [{ some: 'assets' }]
          }
        });
      });
    });

    describe('showSnackBarOnRemoveSuccess', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'snackbar',
            methodName: 'display',
            expectedArguments: ['COLLECTION.REMOVE_FROM_COLLECTION_TOAST', { collectionName: 'someCollectionName' }]
          }
        });
      });
    });

    describe('maybeChangeAssetRouteOnRemoveSuccess', () => {
      let testParameters: EffectTestParameters;

      beforeEach(() => {
        testParameters = {
          effectName: 'maybeChangeAssetRouteOnRemoveSuccess',
          effectsInstantiator: instantiator,
          inputAction: {
            type: ActiveCollectionActions.RemoveAssetSuccess.Type
          },
          state: [
            {
              storeSectionName: 'asset',
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
          ]
        };
      });

      it('does nothing if the active route is not /asset', () => {
        mockRouter.routerState.snapshot.url = '/something/else';

        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('does nothing if the removed asset ID does not match the currently displayed asset', () => {
        (testParameters.state as any)[1].value.latestRemoval.assetId = 456;

        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('does nothing if the removed asset UUID does not match the currently displayed asset', () => {
        (testParameters.state as any)[1].value.latestRemoval.uuid = 'MNOP';

        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('otherwise activates a route for the first collection asset it finds with the same asset ID', () => {
        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', { uuid: 'EFGH' }]);
        });
      });

      it('otherwise activates a route with the same asset ID and no UUID if no instances of asset ID remain', () => {
        (testParameters.state as any)[1].value.collection.assets.items = [];

        effectsSpecHelper.generateCustomTestFor(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', {}]);
        });
      });
    });

    describe('updateAssetMarkers', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
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
          outputActionFactory: {
            sectionName: 'activeCollection',
            methodName: 'updateAssetMarkersSuccess',
            expectedArguments: [{ some: 'assets' }]
          }
        });
      });
    });
  });
}
