import { AssetEffects } from './asset.effects';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

import * as CartAssetActions from '../cart-asset/cart-asset.actions';
import * as QuoteShowAssetActions from '../quote-show-asset/quote-show-asset.actions';
import * as QuoteEditAssetActions from '../quote-edit-asset/quote-edit-asset.actions';
import * as SearchAssetActions from '../search-asset/search-asset.actions';
import * as ActiveCollectionAssetActions from '../active-collection-asset/active-collection-asset.actions';

export function main() {
  describe('Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new AssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService);
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadDeliveryOptions',
      effectsInstantiator: instantiator,
      inputAction: {
        type: SearchAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: 123 }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [123],
        returnsObservableOf: [{ some: 'deliveryOption' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsSuccess',
          expectedArguments: [[{ some: 'deliveryOption' }]]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadDeliveryOptions',
      effectsInstantiator: instantiator,
      comment: 'cartAsset with list',
      inputAction: {
        type: CartAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: 123 }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [123],
        returnsObservableOf: [{ some: 'deliveryOption' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsSuccess',
          expectedArguments: [[{ some: 'deliveryOption' }]]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadDeliveryOptions',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: 123 }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [123],
        returnsObservableOf: [{ some: 'deliveryOption' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsSuccess',
          expectedArguments: [[{ some: 'deliveryOption' }]]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadDeliveryOptions',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteShowAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: 123 }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [123],
        returnsObservableOf: [{ some: 'deliveryOption' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsSuccess',
          expectedArguments: [[{ some: 'deliveryOption' }]]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadDeliveryOptions',
      effectsInstantiator: instantiator,
      inputAction: {
        type: ActiveCollectionAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: 123 }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [123],
        returnsObservableOf: [{ some: 'deliveryOption' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsSuccess',
          expectedArguments: [[{ some: 'deliveryOption' }]]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'loadDeliveryOptionsFailure',
        }
      }
    });
  });
}
