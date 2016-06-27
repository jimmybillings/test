import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {NotificationComponent} from './notification.component';


export function main() {
  describe('Notification Component', () => {

    beforeEachProviders(() => [
      NotificationComponent
    ]);

    it('Should have a Notification instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(NotificationComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof NotificationComponent).toBeTruthy();
        });
      }));
  });
}
