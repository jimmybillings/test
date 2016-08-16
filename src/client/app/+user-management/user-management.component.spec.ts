import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  inject,
  addProviders
} from '../imports/test.imports';

import { UserManagementComponent } from './user-management.component';

export function main() {
  describe('User Management Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray
      ]);
    });

    it('Should have a user-management instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(UserManagementComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof UserManagementComponent).toBeTruthy();
        });
      }));
  });
}
