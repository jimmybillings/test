import {
  beforeEachProvidersArray,
  inject,
  TestBed
} from '../../imports/test.imports';

import { AppNavComponent } from './app-nav.component';


export function main() {
  describe('App Nav Component', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        AppNavComponent
      ]
    }));

    it('Should fire an event to logout a user', inject([AppNavComponent], (component: any) => {
      // spyOn(component.onLogOut, 'emit');
      // component.logOut(event);
      // expect(component.onLogOut.emit).toHaveBeenCalledWith(event);
    }));
  });
}
