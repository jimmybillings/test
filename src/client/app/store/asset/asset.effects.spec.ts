import { AssetEffects } from './asset.effects';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

import * as CartAssetActions from '../cart-asset/cart-asset.actions';
import * as QuoteShowAssetActions from '../quote-show-asset/quote-show-asset.actions';
import * as QuoteEditAssetActions from '../quote-edit-asset/quote-edit-asset.actions';
import * as OrderAssetActions from '../order-asset/order-asset.actions';
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
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'searchAsset without list',
      inputAction: {
        type: SearchAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: {}
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'searchAsset with list',
      inputAction: {
        type: SearchAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: { list: [] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [true]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'orderAsset without list',
      inputAction: {
        type: OrderAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: {}
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'orderAsset with list',
      inputAction: {
        type: OrderAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: { list: [] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [true]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'cartAsset without list',
      inputAction: {
        type: CartAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: {}
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'cartAsset with list',
      inputAction: {
        type: CartAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: { list: [] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [true]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'quoteEditAsset without list',
      inputAction: {
        type: QuoteEditAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: {}
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'quoteEditAsset with list',
      inputAction: {
        type: QuoteEditAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: { list: [] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [true]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'quoteShowAsset without list',
      inputAction: {
        type: QuoteShowAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: {}
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'quoteShowAsset with list',
      inputAction: {
        type: QuoteShowAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: { list: [] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [true]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'activeCollectionAsset without list',
      inputAction: {
        type: ActiveCollectionAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: {}
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'getDeliveryOptionsOnLoadSuccess',
      effectsInstantiator: instantiator,
      comment: 'activeCollectionAsset with list',
      inputAction: {
        type: ActiveCollectionAssetActions.LoadSuccess.Type,
        activeAsset: { assetId: { some: 'assetId' } }
      },
      serviceMethod: {
        name: 'getDeliveryOptions',
        expectedArguments: [{ some: 'assetId' }],
        returnsObservableOf: { list: [] }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [true]
        },
        failure: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptionsFailure',
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'resetDeliveryOptionsOnLoad',
      effectsInstantiator: instantiator,
      comment: 'SearchAsset',
      inputAction: {
        type: SearchAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'resetDeliveryOptionsOnLoad',
      effectsInstantiator: instantiator,
      comment: 'OrderAsset',
      inputAction: {
        type: OrderAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'resetDeliveryOptionsOnLoad',
      effectsInstantiator: instantiator,
      comment: 'CartAsset',
      inputAction: {
        type: CartAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'resetDeliveryOptionsOnLoad',
      effectsInstantiator: instantiator,
      comment: 'QuoteEditAsset',
      inputAction: {
        type: QuoteEditAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'resetDeliveryOptionsOnLoad',
      effectsInstantiator: instantiator,
      comment: 'QuoteShowAsset',
      inputAction: {
        type: QuoteShowAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'resetDeliveryOptionsOnLoad',
      effectsInstantiator: instantiator,
      comment: 'ActiveCollectionAsset',
      inputAction: {
        type: ActiveCollectionAssetActions.Load.Type,
        loadParameters: { some: 'loadParameters' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'asset',
          methodName: 'setDeliveryOptions',
          expectedArguments: [false]
        }
      }
    });
  });
}
