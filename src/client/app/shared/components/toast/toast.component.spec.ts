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

    var mockUiStateChanges: any = {message: 'Welcome Ross!', type: 'success'};

    it('Should have a Notification instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ToastComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ToastComponent).toBeTruthy();
        });
      }));

    it('Should have message and type instance variables',
      inject([ToastComponent], (component: ToastComponent) => {
        expect(component.message).toBeDefined();
        expect(component.type).toBeDefined();
      }));

    it('Should have a checkUiStateChanges method that doesn\'t update message if no message',
      inject([ToastComponent], (component: ToastComponent) => {
        component.updateMessage(mockUiStateChanges);
        expect(component.message).toBe('Welcome Ross!');
      }));
  });
}
