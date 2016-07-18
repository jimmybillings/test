import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { Router, RouterOutletMap, ActivatedRoute } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

export function main() {
  describe('User Management Component', () => {
    class MockRouter { }
    class MockActivatedRoute { }
    beforeEachProviders(() => [
      { provide: Router, useClass: MockRouter },
      { provide: ActivatedRoute, useClass: MockActivatedRoute },
      RouterOutletMap
    ]);

    it('Should have a user-management instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(UserManagementComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof UserManagementComponent).toBeTruthy();
        });
      }));

  });
}
