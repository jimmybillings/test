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

    var mockStateChanges: any = {previousValue: '', currentValue: '/user/login'};
    var mockStateChangesNotify: any = {previousValue: '', currentValue: '/user/login;loggedOut=true'};
    var mockUiStateChanges: any = {previousValue: {message: 'Welcome Ross!', type: 'success'}, currentValue: {}};
    var mockUiStateChangesNotify: any = {previousValue: {}, currentValue: {message: 'Welcome Ross!', type: 'success'}};

    it('Should have a Notification instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(NotificationComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof NotificationComponent).toBeTruthy();
        });
      }));

    it('Should have notice and type instance variables',
      inject([NotificationComponent], (component: NotificationComponent) => {
        expect(component.notice).toBeDefined();
        expect(component.type).toBeDefined();
      }));

    it('Should have a checkStateChanges method that doesn\'t update notice with no change',
      inject([NotificationComponent], (component: NotificationComponent) => {
        component.checkStateChanges(mockStateChanges);
        expect(component.notice).toBe(null);
      }));

    it('Should have a checkStateChanges method that updates notice with loggedOut=true',
      inject([NotificationComponent], (component: NotificationComponent) => {
        component.checkStateChanges(mockStateChangesNotify);
        expect(component.notice).toBe('Your session has expired and you must login again.');
      }));

    it('Should have a checkUiStateChanges method that doesn\'t update notice if no message',
      inject([NotificationComponent], (component: NotificationComponent) => {
        component.checkUiStateChanges(mockUiStateChanges);
        expect(component.notice).toBe(null);
      }));

    it('Should have a checkUiStateChanges method that updates notice with message',
      inject([NotificationComponent], (component: NotificationComponent) => {
        component.checkUiStateChanges(mockUiStateChangesNotify);
        expect(component.notice).toBe(mockUiStateChangesNotify.currentValue.message);
      }));
  });
}
