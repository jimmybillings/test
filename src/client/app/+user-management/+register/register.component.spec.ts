import {
  beforeEachProvidersArray,
  inject,
  addProviders
} from '../../imports/test.imports';

import { RegisterComponent } from './register.component';

export function main() {
  describe('Register Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        RegisterComponent
      ]);
    });

    it('Should register new user and console log the response for now.',
      inject([RegisterComponent], (register: RegisterComponent) => {
        register.onSubmit({
          'firstName': 'first',
          'lastName': 'second',
          'emailAddress': 'third',
          'password': 'fourth',
          'siteName': register._ApiConfig.getPortal()
        });
      }));
  });
}
