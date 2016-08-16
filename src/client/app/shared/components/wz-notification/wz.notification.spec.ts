import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  inject,
  addProviders
} from '../../../imports/test.imports';

import { WzNotificationComponent } from './wz.notification.component';

export function main() {
  describe('Notification Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        WzNotificationComponent
      ]);
    });

    it('Should have a Notification instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzNotificationComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzNotificationComponent).toBeTruthy();
        });
      }));
  });
}
