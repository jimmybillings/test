import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { FooterComponent } from './footer.component';

export function main() {
  describe('Footer Component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      FooterComponent
    ]);

    it('Should have a footer instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(FooterComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof FooterComponent).toBeTruthy();
        });
      }));

    it('Should fire an event to change the current selected language', inject([FooterComponent], (component: FooterComponent) => {
      spyOn(component.onChangeLang, 'emit');
      component.changeLang({target: {value: 'fr'}});
      expect(component.onChangeLang.emit).toHaveBeenCalledWith('fr');
    }));
  });
}
