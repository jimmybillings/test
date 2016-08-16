import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  inject,
  addProviders
} from '../../imports/test.imports';

import { BinTrayComponent } from './bin-tray.component';

export function main() {
  describe('Bin Tray Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray
      ]);
    });

    it('Should have a bin tray instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(BinTrayComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof BinTrayComponent).toBeTruthy();
        });
      }));
  });
}
