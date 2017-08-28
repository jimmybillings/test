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
      factoryMethod: {
        class: ActionFactory,
        name: 'followRedirect',
        parameters: []
      },
      expectedAction: {
        type: '[Router] Follow Redirect'
      }
    });
  });
}
