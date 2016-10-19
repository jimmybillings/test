import {
  TestBed,
  Observable,
  inject,
} from '../../imports/test.imports';

import { ForgotPasswordComponent } from './forgot-password.component';
import { User } from '../services/user.data.service';
import { UiConfig } from '../../shared/services/ui.config';

export function main() {
  describe('Forgot Password Component', () => {

    const MockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
    const MockUser = { forgotPassword: (user: Object) => { return Observable.of({}); } };

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        { provide: User, useValue: MockUser },
        { provide: UiConfig, useValue: MockUiConfig },
        ForgotPasswordComponent,
      ]
    }));

    it('Should get component config and assign to new instance variable',
      inject([ForgotPasswordComponent], (component: ForgotPasswordComponent) => {
        component.ngOnInit();
        expect(component.config).toEqual({ someConfig: 'test' });
      }));

    it('Should submit a request for a password reset and show the confirmation message',
      inject([ForgotPasswordComponent], (component: ForgotPasswordComponent) => {
        spyOn(component.user, 'forgotPassword').and.callThrough();
        component.onSubmit({ 'emailAddress': 'test@test.com' });
        expect(component.user.forgotPassword).toHaveBeenCalledWith({ 'emailAddress': 'test@test.com' });
        expect(component.successfullySubmitted).toEqual(true);
      }));

  });
}
