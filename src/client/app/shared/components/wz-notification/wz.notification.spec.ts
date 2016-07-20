import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../../imports/test.imports';

import { WzNotificationComponent } from './wz.notification.component';

export function main() {
  describe('Notification Component', () => {

    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      WzNotificationComponent
    ]);

    it('Should have a Notification instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzNotificationComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzNotificationComponent).toBeTruthy();
        });
      }));
  });
}
