import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  CurrentUser,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { DashboardComponent} from './dashboard.component';

export function main() {
  describe('Admin Dashboard component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      DashboardComponent
    ]);

    it('Create instance of dashboard and assign the CurrentUser to an instance variable inside of dashboard',
      inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(DashboardComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof DashboardComponent).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));
  });
}
