import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';

import {Notification} from './notification.component';


export function main() {
  describe('Notification Component', () => {

    beforeEachProviders(() => [
      Notification
    ]);

    it('Should have a Notification instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Notification).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Notification).toBeTruthy();
        });
      }));
  });
}
