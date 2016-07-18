import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { SiteConfigComponent } from './site-config.component';
import { ActivatedRoute } from '@angular/router';

export function main() {
  describe('Admin Site Config Component', () => {
    class MockActivatedRoute {}
    beforeEachProviders(() => [
      SiteConfigComponent,
      { provide: ActivatedRoute, useClass: MockActivatedRoute },
    ]);

    it('Create an instance of Site Config',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(SiteConfigComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof SiteConfigComponent).toBeTruthy();
        });
      }));
  });
}
