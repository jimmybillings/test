import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { BinTrayComponent } from './bin-tray.component';

export function main() {
  describe('Bin Tray Component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    it('Should have a bin tray instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(BinTrayComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof BinTrayComponent).toBeTruthy();
        });
      }));
  });
}
