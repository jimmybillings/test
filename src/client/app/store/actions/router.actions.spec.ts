import { ActionFactory, InternalActionFactory } from './router.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Router Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'goToLogin',
        parameters: []
      },
      expectedAction: {
        type: '[Router] Go To Login'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'goToLoginWithRedirect',
        parameters: []
      },
      expectedAction: {
        type: '[Router] Go To Login With Redirect'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'goToPageNotFound',
        parameters: []
      },
      expectedAction: {
        type: '[Router] Go To Page Not Found'
      }
    });

    actionsSpecHelper.generateTestFor({
      comment: 'without markers',
      factoryMethod: {
        class: ActionFactory,
        name: 'goToSearchAssetDetails',
        parameters: [42]
      },
      expectedAction: {
        type: '[Router] Go To Search Asset Details',
        assetId: 42,
        markers: undefined
      }
    });

    actionsSpecHelper.generateTestFor({
      comment: 'with markers',
      factoryMethod: {
        class: ActionFactory,
        name: 'goToSearchAssetDetails',
        parameters: [42, { some: 'markers' }]
      },
      expectedAction: {
        type: '[Router] Go To Search Asset Details',
        assetId: 42,
        markers: { some: 'markers' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'followRedirect',
        parameters: []
      },
      expectedAction: {
        type: '[Router] Follow Redirect'
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'goToQuotes',
        parameters: []
      },
      expectedAction: {
        type: '[Router] Go To Quotes'
      }
    });
  });
}
