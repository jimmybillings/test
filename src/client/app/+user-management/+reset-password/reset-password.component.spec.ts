import { Observable } from '../../imports/test.imports';
import { ResetPasswordComponent } from './reset-password.component';
import { User } from '../services/user.data.service';
import { UiConfig } from '../../shared/services/ui.config';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UserPreferenceService } from '../../shared/services/user-preference.service';

export function main() {
  describe('Reset Password Component', () => {
    let mockUiConfig:any, mockUser:any, mockActivatedRoute:any, mockRouter:any, mockCurrentUser:any, mockUserPreference:any;
    let serviceUnderTest: ResetPasswordComponent;
    
    beforeEach(() => {
      mockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } });}};
      mockUser = { 
        resetPassword: jasmine.createSpy('resetPassword').and.returnValue(Observable.of({ user: 'james', token: {token: 'loginToken'}, userPreferences: {pref: 1}}))
      };
      mockActivatedRoute = { snapshot: { queryParams : { shareKey: 'sldkjf2938sdlkjf289734'}}};
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      mockCurrentUser = { set: jasmine.createSpy('set') };
      mockUserPreference = { set: jasmine.createSpy('set') };
      serviceUnderTest = new ResetPasswordComponent(mockUser, mockUiConfig, mockActivatedRoute, mockRouter, mockCurrentUser, mockUserPreference)
    });

    describe('ngOnInit()', () => {
      it('Grabs the component config and assigns to an instance variable', () => {
        serviceUnderTest.ngOnInit();
        expect(serviceUnderTest.config).toEqual({ someConfig: 'test' });
      });
    });

    describe('onSubmit()', () => {
      it('Submits a set new password request', () => {
          serviceUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
          expect(mockUser.resetPassword).toHaveBeenCalledWith({ 'newPassword': 'myNewTestPassword' }, 'sldkjf2938sdlkjf289734');
      });

      it('Sets a new user and auth token on response', () => {
          serviceUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
          expect(mockCurrentUser.set).toHaveBeenCalledWith('james', 'loginToken');
      });

      it('Sets the user preferences', () => {
          serviceUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
          expect(mockUserPreference.set).toHaveBeenCalledWith({pref: 1});
      });

      it('Navigates to the home page', () => {
          serviceUnderTest.onSubmit({ 'newPassword': 'myNewTestPassword' });
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      });
    });

  });
}
