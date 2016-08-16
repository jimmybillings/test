import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  addProviders,
  inject,
} from '../imports/test.imports';

import { AdminComponent } from './admin.component';

export function main() {
  describe('Admin Component', () => {
    beforeEach(() => {
      addProviders([
      ...beforeEachProvidersArray
    ]);
  });

    it('Should have an admin instance',
      inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(AdminComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AdminComponent).toBeTruthy();
        });
      }));
  });
}
