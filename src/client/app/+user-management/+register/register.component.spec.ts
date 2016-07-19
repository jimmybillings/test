import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { RegisterComponent } from './register.component';

export function main() {
  describe('Register Component', () => {

    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      RegisterComponent
    ]);

    it('Should have a Register instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(RegisterComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof RegisterComponent).toBeTruthy();
        });
      }));

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
