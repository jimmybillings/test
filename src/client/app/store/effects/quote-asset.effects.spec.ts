import { QuoteAssetEffects } from './quote-asset.effects';
import * as QuoteAssetActions from '../actions/quote-asset.actions';
import * as QuoteActions from '../actions/quote.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Quote Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new QuoteAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAfterQuoteAvailable',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteAssetActions.LoadAfterQuoteAvailable.Type,
        loadParameters: { id: '50', uuid: 'abc-123' }
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { assetId: '50' },
        expectedArguments: [{ id: '50', uuid: 'abc-123' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ assetId: '50' }]
        },
        failure: {
          sectionName: 'quoteAsset',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the quote is NOT yet loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'quote',
        value: { data: { id: 0 } }
      },
      inputAction: {
        type: QuoteAssetActions.Load.Type,
        loadParameters: { uuid: 'abc-123' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'quote',
          methodName: 'load',
          expectedArguments: []
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the quote IS loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'quote',
        value: {
          data: {
            id: 1,
            projects: [
              { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
            ]
          }
        }
      },
      inputAction: {
        type: QuoteAssetActions.Load.Type,
        loadParameters: { uuid: 'abc-123' }
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteAsset',
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
          storeSectionName: 'quoteAsset',
          value: { loadParameters: { uuid: 'abc-123' } }
        },
        {
          storeSectionName: 'quote',
          value: {
            data: {
              id: 1,
              projects: [
                { lineItems: [{ id: 'abc-123', asset: { assetId: 50, uuid: 'abc-123', timeStart: 500, timeEnd: 5000 } }] }
              ]
            }
          }
        }
      ],
      inputAction: {
        type: QuoteActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteAsset',
          methodName: 'loadAfterQuoteAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });
  });
}
