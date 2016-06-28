import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {ToastComponent} from './toast.component';


export function main() {
  describe('Notification Component', () => {

    beforeEachProviders(() => [
      ToastComponent
    ]);

    it('Should have a Notification instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ToastComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ToastComponent).toBeTruthy();
        });
      }));
  });
}
