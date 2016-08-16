import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  addProviders,
  inject,
} from '../../imports/test.imports';

import {ProfileComponent} from './profile.component';

export function main() {
  describe('Profile Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray
      ]);
    });

    it('Create instance of profile and assign the CurrentUser to an instance variable inside of profile',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ProfileComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ProfileComponent).toBeTruthy();
        });
      }));
  });
}
