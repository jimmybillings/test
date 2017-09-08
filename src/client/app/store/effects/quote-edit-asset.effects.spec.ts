import { QuoteEditAssetEffects } from './quote-edit-asset.effects';
import * as QuoteEditAssetActions from '../actions/quote-edit-asset.actions';
import * as QuoteEditActions from '../actions/quote-edit.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Quote Edit Asset Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): any {
      return new QuoteEditAssetEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'loadAfterQuoteAvailable',
      effectsInstantiator: instantiator,
      inputAction: {
        type: QuoteEditAssetActions.LoadAfterQuoteAvailable.Type,
        loadParameters: { id: '50', uuid: 'abc-123' }
      },
      serviceMethod: {
        name: 'load',
        returnsObservableOf: { assetId: '50' },
        expectedArguments: [{ id: '50', uuid: 'abc-123' }]
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEditAsset',
          methodName: 'loadSuccess',
          expectedArguments: [{ assetId: '50' }]
        },
        failure: {
          sectionName: 'quoteEditAsset',
          methodName: 'loadFailure'
        }
      }
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'load',
      comment: 'when the quote is NOT yet loaded',
      effectsInstantiator: instantiator,
      state: {
        storeSectionName: 'quoteEdit',
        value: { data: { id: 0 } }
      },
      inputAction: {
        type: QuoteEditAssetActions.Load.Type,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEdit',
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
        storeSectionName: 'quoteEdit',
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
        type: QuoteEditAssetActions.Load.Type,
        assetUuid: 'abc-123'
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEditAsset',
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
          storeSectionName: 'quoteEditAsset',
          propertyName: 'loadingUuid',
          value: 'abc-123'
        },
        {
          storeSectionName: 'quoteEdit',
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
        type: QuoteEditActions.LoadSuccess.Type
      },
      outputActionFactories: {
        success: {
          sectionName: 'quoteEditAsset',
          methodName: 'loadAfterQuoteAvailable',
          expectedArguments: [{ id: '50', uuid: 'abc-123', timeStart: '500', timeEnd: '5000' }]
        }
      }
    });
  });
}
