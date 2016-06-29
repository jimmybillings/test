import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { AppNavComponent} from './app-nav.component';
import { Router } from '@angular/router';
import { UiConfig} from '../../services/ui.config';

export function main() {
  describe('App Nav Component', () => {
    class MockRouter {
      navigate(params: any) {
        return params;
      }
    }
    beforeEachProviders(() => [
      AppNavComponent,
      { provide: Router, useClass: MockRouter },
      UiConfig,
    ]);

    it('Should have a header instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AppNavComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AppNavComponent).toBeTruthy();
        });
      }));

    it('Should fire an event to logout a user', inject([AppNavComponent], (component: any) => {
      spyOn(component.onLogOut, 'emit');
      component.logOut(event);
      expect(component.onLogOut.emit).toHaveBeenCalledWith(event);
    }));
  });
}
