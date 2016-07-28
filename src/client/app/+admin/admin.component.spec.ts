import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it
} from '../imports/test.imports';

import { AdminComponent } from './admin.component';

export function main() {
  describe('Admin Component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should have an admin instance',
      inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(AdminComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AdminComponent).toBeTruthy();
        });
      }));
  });
}
