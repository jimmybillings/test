import { QuoteShowAssetEffects } from './quote-show-asset.effects';
import * as QuoteShowAssetActions from '../actions/quote-show-asset.actions';
import * as QuoteShowActions from '../actions/quote-show.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Quote Show Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new QuoteShowAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAfterQuoteAvailable',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteShowAssetActions.LoadAfterQuoteAvailable.Type,
        loadParameters: { id: '50', uuid: 'abc-123' }
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { assetId: '50' },
        expectedArguments: [{ id: '50', uuid: 'abc-123' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteShowAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ assetId: '50' }]
        },
        failure: {
          sectionName: 'quoteShowAsset',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the quote is NOT yet loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'quoteShow',
        propertyName: 'data',
        value: { id: 0, data: { id: null } }
      },
      inputAction: {
        type: QuoteShowAssetActions.Load.Type,
        quoteId: 47,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteShow',
          methodName: 'load',
          expectedArguments: [47]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the quote IS loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'quoteShow',
        propertyName: 'data',
        value: {
          id: 47,
          projects: [
            { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
          ]
        }
      },
      inputAction: {
        type: QuoteShowAssetActions.Load.Type,
        quoteId: 47,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteShowAsset',
          methodName: 'loadAfterQuoteAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAssetOnQuoteLoadSuccess',
      comment: 'when the asset store HAS load parameters',
      effectsInstantiator: instantiator,
      state: [
        {
          storeSectionName: 'quoteShowAsset',
          propertyName: 'loadingUuid',
          value: 'abc-123'
        },
        {
          storeSectionName: 'quoteShow',
          propertyName: 'data',
          value: {
            id: 1,
            projects: [
              { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
            ]
          }
        }
      ],
      inputAction: {
        type: QuoteShowActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteShowAsset',
          methodName: 'loadAfterQuoteAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });
  });
}
