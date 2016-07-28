import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { SiteConfigComponent } from './site-config.component';

export function main() {
  describe('Admin Site Config Component', () => {
    class MockActivatedRoute {}
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      SiteConfigComponent,
    ]);

    it('Create an instance of Site Config',
      inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(SiteConfigComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof SiteConfigComponent).toBeTruthy();
        });
      }));
  });
}
