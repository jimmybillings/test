import {
  beforeEachProvidersArray,
  inject,
  addProviders
} from '../../imports/test.imports';

import { FooterComponent } from './footer.component';

export function main() {
  describe('Footer Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        FooterComponent
      ]);
    });

    it('Should fire an event to change the current selected language', inject([FooterComponent], (component: FooterComponent) => {
      spyOn(component.onChangeLang, 'emit');
      component.changeLang({target: {value: 'fr'}});
      expect(component.onChangeLang.emit).toHaveBeenCalledWith('fr');
    }));
  });
}
