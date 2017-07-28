import { ActiveCollectionEffects } from './active-collection.effects';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
import { StoreSpecHelper, EffectTestParameters } from '../store.spec-helper';

export function main() {
  describe('Active Collection Effects', () => {
    let storeSpecHelper: StoreSpecHelper;
    let mockUserPreferenceService: any;
    let mockRouter: any;

    function instantiator(): ActiveCollectionEffects {
      return new ActiveCollectionEffects(
        storeSpecHelper.mockNgrxEffectsActions, storeSpecHelper.mockStore, storeSpecHelper.mockService,
        mockUserPreferenceService, mockRouter
      );
    }

    beforeEach(() => {
      storeSpecHelper = new StoreSpecHelper();
      mockUserPreferenceService = { openCollectionTray: jasmine.createSpy('openCollectionTray') };
      // return this.router.routerState.snapshot.url.startsWith('/asset');
      mockRouter = {
        navigate: jasmine.createSpy('navigate'),
        routerState: { snapshot: { url: '/asset/blahblahblah' } }
      };
    });

    describe('load', () => {
      it('works as expected', () => {
        storeSpecHelper.runStandardEffectTest({
          effectName: 'load',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.Load,
            payload: { some: 'payload' }
          },
          serviceMethod: {
            name: 'load',
            expectedArguments: [{ some: 'payload' }],
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
        storeSpecHelper.runStandardEffectTest({
          effectName: 'set',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.Set,
            payload: { collectionId: 42, parameters: { some: 'parameters' } }
          },
          serviceMethod: {
            name: 'set',
            expectedArguments: [42, { some: 'parameters' }],
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
        storeSpecHelper.runStandardEffectTest({
          effectName: 'loadPage',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.LoadPage,
            payload: { some: 'payload' }
          },
          state: {
            storeSectionName: 'activeCollection',
            propertyName: 'collection',
            value: { id: 123 }
          },
          serviceMethod: {
            name: 'loadPage',
            expectedArguments: [123, { some: 'payload' }],
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
        storeSpecHelper.runCustomEffectTest(
          {
            effectName: 'openTrayOnAddOrRemove',
            effectsInstantiator: instantiator,
            inputAction: {
              class: ActiveCollectionActions.AddAsset
            }
          },
          () => {
            expect(mockUserPreferenceService.openCollectionTray).toHaveBeenCalled();
          }
        );
      });

      it('works as expected for ActiveCollectionActions.RemoveAsset', () => {
        storeSpecHelper.runCustomEffectTest(
          {
            effectName: 'openTrayOnAddOrRemove',
            effectsInstantiator: instantiator,
            inputAction: {
              class: ActiveCollectionActions.RemoveAsset
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
        storeSpecHelper.runStandardEffectTest({
          effectName: 'addAsset',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.AddAsset,
            payload: { asset: { some: 'asset' }, markers: { some: 'markers' } }
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
        storeSpecHelper.runStandardEffectTest({
          effectName: 'showSnackBarOnAddSuccess',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.AddAssetSuccess,
            payload: { some: 'assets' }
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

    describe('maybeChangeAssetRouteOnAddSuccess', () => {
      let testParameters: EffectTestParameters;

      beforeEach(() => {
        testParameters = {
          effectName: 'maybeChangeAssetRouteOnAddSuccess',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.AddAssetSuccess
          },
          state: [
            {
              storeSectionName: 'asset',
              propertyName: 'currentAsset',
              value: { assetId: 123 }
            },
            {
              storeSectionName: 'activeCollection',
              value: {
                latestAddition: {
                  asset: { assetId: 123 },
                  markers: { latest: 'markers' }
                },
                collection: {
                  assets: {
                    items: [
                      {
                        assetId: 123,
                        uuid: 'ABCD',
                        timeStart: 1234,
                        timeEnd: 5678
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
          helperServiceMethods: [
            {
              name: 'timeStartFrom',
              returns: 1234
            },
            {
              name: 'timeEndFrom',
              returns: 5678
            }
          ]
        };
      });

      it('does nothing if the active route is not /asset', () => {
        mockRouter.routerState.snapshot.url = '/something/else';

        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('does nothing if the added asset ID does not match the currently displayed asset', () => {
        (testParameters.state as any)[1].value.latestAddition.asset.assetId = 456;

        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('otherwise activates a route for a newly added asset', () => {
        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', { uuid: 'ABCD', timeStart: '1234', timeEnd: '5678' }]);
        });
      });

      it('otherwise activates a route for a newly added asset without markers', () => {
        testParameters.helperServiceMethods[0].returns = undefined;
        testParameters.helperServiceMethods[1].returns = undefined;

        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', { uuid: 'EFGH' }]);
        });
      });
    });

    describe('removeAsset', () => {
      it('works as expected', () => {
        storeSpecHelper.runStandardEffectTest({
          effectName: 'removeAsset',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.RemoveAsset,
            payload: { some: 'asset' }
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
        storeSpecHelper.runStandardEffectTest({
          effectName: 'showSnackBarOnRemoveSuccess',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.RemoveAssetSuccess,
            payload: { some: 'assets' }
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
            class: ActiveCollectionActions.RemoveAssetSuccess
          },
          state: [
            {
              storeSectionName: 'asset',
              propertyName: 'currentAsset',
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

        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('does nothing if the removed asset ID does not match the currently displayed asset', () => {
        (testParameters.state as any)[1].value.latestRemoval.assetId = 456;

        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('does nothing if the removed asset UUID does not match the currently displayed asset', () => {
        (testParameters.state as any)[1].value.latestRemoval.uuid = 'MNOP';

        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });

      it('otherwise activates a route for the first collection asset it finds with the same asset ID', () => {
        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', { uuid: 'EFGH' }]);
        });
      });

      it('otherwise activates a route with the same asset ID and no UUID if no instances of asset ID remain', () => {
        (testParameters.state as any)[1].value.collection.assets.items = [];

        storeSpecHelper.runCustomEffectTest(testParameters, () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/asset/123', {}]);
        });
      });
    });

    describe('updateAssetMarkers', () => {
      it('works as expected', () => {
        storeSpecHelper.runStandardEffectTest({
          effectName: 'updateAssetMarkers',
          effectsInstantiator: instantiator,
          inputAction: {
            class: ActiveCollectionActions.UpdateAssetMarkers,
            payload: { asset: { some: 'asset' }, markers: { some: 'markers' } }
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
