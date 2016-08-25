import {
  beforeEachProvidersArray,
  inject,
  addProviders,
  Observable
} from '../../imports/test.imports';

import { RegisterComponent } from './register.component';
import { User } from '../services/user.data.service';
const user:any = { emailAddress: 'jamesbonline@yahoo.com', firstName: 'james', lastName: 'billigns', password: '3978f324e14ac256b2994b754586e05f'};
export function main() {
  describe('Register Component', () => {
    
    class MockUser {
      create() {
        return Observable.of(user);
      }
    }

    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        { provide: User, useClass: MockUser },,
        RegisterComponent
      ]);
    });

    it('Should register new user and console log the response for now.',
      inject([RegisterComponent], (register: RegisterComponent) => {
        spyOn(register.uiState, 'loading');
        register.onSubmit(user);
        expect(register.uiState.loading).toHaveBeenCalledWith(false);
        expect(register.successfullySubmitted).toEqual(true);
        expect(register.newUser).toEqual(user);
      }));
  });
}
