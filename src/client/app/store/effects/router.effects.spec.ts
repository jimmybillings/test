import { Subject } from 'rxjs/Subject';

import { RouterEffects } from './router.effects';
import * as RouterActions from '../actions/router.actions';
import { EffectsSpecHelper } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Router Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();
    let mockRouter: any;
    let mockLocation: any;
    let localStorageSetSpy: jasmine.Spy;
    let localStorageGetSpy: jasmine.Spy;
    let localStorageRemoveSpy: jasmine.Spy;
    let mockCurrentPath: string;

    beforeEach(() => {
      mockRouter = {
        navigate: jasmine.createSpy('navigate'),
        navigateByUrl: jasmine.createSpy('navigateByUrl')
      };

      mockLocation = {
        path: () => mockCurrentPath
      };

      localStorageSetSpy = spyOn(localStorage, 'setItem').and.stub();
      localStorageGetSpy = spyOn(localStorage, 'getItem').and.returnValue('SOME URL');
      localStorageRemoveSpy = spyOn(localStorage, 'removeItem').and.stub();
    });

    function instantiator(): any {
      return new RouterEffects(effectsSpecHelper.mockNgrxEffectsActions, mockRouter, mockLocation);
    }

    effectsSpecHelper.generateTestsFor({
      effectName: 'goToLogin',
      effectsInstantiator: instantiator,
      inputAction: {
        type: RouterActions.GoToLogin.Type
      },
      customTests: [
        {
          it: 'navigates to /user/login',
          expectation: () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/login']);
          }
        }
      ]
    });

    describe('goToLoginWithRedirect', () => {
      describe('from any path except /user/login', () => {
        beforeEach(() => {
          mockCurrentPath = 'SOME URL';
        });

        effectsSpecHelper.generateTestsFor({
          effectName: 'goToLoginWithRedirect',
          effectsInstantiator: instantiator,
          inputAction: {
            type: RouterActions.GoToLoginWithRedirect.Type
          },
          customTests: [
            {
              it: 'stores the current location in local storage',
              expectation: () => {
                expect(localStorageSetSpy).toHaveBeenCalledWith('RouterEffects.RedirectUrl', 'SOME URL');
              }
            },
            {
              it: 'navigates to /user/login',
              expectation: () => {
                expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/login', { requireLogin: true }]);
              }
            }
          ]
        });
      });

      describe('from /user/login', () => {
        beforeEach(() => {
          mockCurrentPath = '/user/login';
        });

        effectsSpecHelper.generateTestsFor({
          effectName: 'goToLoginWithRedirect',
          effectsInstantiator: instantiator,
          inputAction: {
            type: RouterActions.GoToLoginWithRedirect.Type
          },
          customTests: [
            {
              it: 'doesn\'t navigate to /user/login',
              expectation: () => {
                expect(mockRouter.navigate).not.toHaveBeenCalled();
              }
            }
          ]
        });
      });

      describe('from /user/login with query params', () => {
        beforeEach(() => {
          mockCurrentPath = '/user/login;requireLogin=true';
        });

        effectsSpecHelper.generateTestsFor({
          effectName: 'goToLoginWithRedirect',
          effectsInstantiator: instantiator,
          inputAction: {
            type: RouterActions.GoToLoginWithRedirect.Type
          },
          customTests: [
            {
              it: 'doesn\'t navigate to /user/login',
              expectation: () => {
                expect(mockRouter.navigate).not.toHaveBeenCalled();
              }
            }
          ]
        });
      });

    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'goToPageNotFound',
      effectsInstantiator: instantiator,
      inputAction: {
        type: RouterActions.GoToPageNotFound.Type
      },
      customTests: [
        {
          it: 'navigates to /404',
          expectation: () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
          }
        }
      ]
    });

    effectsSpecHelper.generateTestsFor({
      effectName: 'followRedirect',
      effectsInstantiator: instantiator,
      inputAction: {
        type: RouterActions.FollowRedirect.Type
      },
      customTests: [
        {
          it: 'navigates to the redirect url if it is set',
          expectation: () => {
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('SOME URL');
          }
        },
        {
          it: 'removes the redirect url from local storage if it is set',
          expectation: () => {
            expect(localStorageRemoveSpy).toHaveBeenCalledWith('RouterEffects.RedirectUrl');
          }
        },
        {
          it: `navigates to '/' if the redirect url is not set`,
          beforeInstantiation: () => {
            localStorageGetSpy.and.returnValue(null);
          },
          expectation: () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
          }
        },
        {
          it: 'doesn\'t remove the redirect url from local storage if it is not set',
          beforeInstantiation: () => {
            localStorageGetSpy.and.returnValue(null);
          },
          expectation: () => {
            expect(localStorageRemoveSpy).not.toHaveBeenCalled();
          }
        }
      ]
    });
  });
}
